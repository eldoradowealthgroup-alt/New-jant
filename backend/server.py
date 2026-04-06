from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt
import csv
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Admin credentials
ADMIN_EMAIL = "admin"
ADMIN_PASSWORD = "Money2026$"
ADMIN_NOTIFICATION_EMAIL = os.environ.get('ADMIN_NOTIFICATION_EMAIL', '')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', '')

# Email notification helper
async def send_admin_notification(subject: str, content: str):
    """Send email notification to admin via SendGrid"""
    if not all([SENDGRID_API_KEY, SENDER_EMAIL, ADMIN_NOTIFICATION_EMAIL]):
        logger.info(f"Email notification skipped (not configured): {subject}")
        return False
    
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        message = Mail(
            from_email=SENDER_EMAIL,
            to_emails=ADMIN_NOTIFICATION_EMAIL,
            subject=f"[Citation Lookup] {subject}",
            html_content=content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        logger.info(f"Admin notification sent: {subject}")
        return response.status_code == 202
    except Exception as e:
        logger.error(f"Failed to send admin notification: {e}")
        return False

# Audit log helper
async def log_audit_event(user_id: str, user_email: str, action: str, details: dict = None):
    """Log user action to audit log collection"""
    audit_entry = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "user_email": user_email,
        "action": action,
        "details": details or {},
        "ip_address": "",  # Would be populated from request in production
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.audit_logs.insert_one(audit_entry)
    return audit_entry

# Define Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    is_admin: bool = False

class UserProfileUpdate(BaseModel):
    name: str
    address: str
    dob: str
    phone: str
    email: EmailStr

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None

class CitationSearch(BaseModel):
    name: str
    citation_number: str
    zip_code: str

class Citation(BaseModel):
    citation_id: str
    offense: str
    date: str
    fine: str
    status: str
    location: str

class CitationResult(BaseModel):
    found: bool
    name: Optional[str] = None
    dob: Optional[str] = None
    citations: Optional[List[Citation]] = None
    message: Optional[str] = None

class SubmissionRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    email: str
    name: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    citation_searched: Optional[str] = None
    zip_code: Optional[str] = None
    action_taken: Optional[str] = None
    created_at: str
    updated_at: str

class AuditLogEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_email: str
    action: str
    details: dict = {}
    ip_address: str = ""
    timestamp: str

# Auth routes
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, background_tasks: BackgroundTasks):
    # Check if user exists
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), salt)
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "id": user_id,
        "email": user.email,
        "password": hashed.decode('utf-8'),
        "created_at": now
    }
    
    await db.users.insert_one(user_doc)
    
    # Create submission record for admin tracking
    submission = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "email": user.email,
        "created_at": now,
        "updated_at": now
    }
    await db.submissions.insert_one(submission)
    
    # Log audit event
    await log_audit_event(user_id, user.email, "USER_REGISTERED", {"registration_time": now})
    
    # Send admin notification in background
    background_tasks.add_task(
        send_admin_notification,
        "New User Registration",
        f"""
        <h2>New User Registered</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user_id}</p>
        <p><strong>Time:</strong> {now}</p>
        """
    )
    
    return UserResponse(id=user_id, email=user.email, is_admin=False)

@api_router.post("/auth/login", response_model=UserResponse)
async def login(user: UserLogin):
    # Check for admin login
    if user.email == ADMIN_EMAIL and user.password == ADMIN_PASSWORD:
        await log_audit_event("admin", "admin", "ADMIN_LOGIN", {})
        return UserResponse(id="admin", email="admin", is_admin=True)
    
    # Find user
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check password
    if not bcrypt.checkpw(user.password.encode('utf-8'), existing['password'].encode('utf-8')):
        await log_audit_event(existing.get('id', 'unknown'), user.email, "LOGIN_FAILED", {"reason": "invalid_password"})
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Log successful login
    await log_audit_event(existing['id'], existing['email'], "USER_LOGIN", {})
    
    return UserResponse(id=existing['id'], email=existing['email'], is_admin=False)

# Profile routes
@api_router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(**user)

@api_router.put("/profile/{user_id}", response_model=UserProfile)
async def update_profile(user_id: str, profile: UserProfileUpdate, background_tasks: BackgroundTasks):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    now = datetime.now(timezone.utc).isoformat()
    
    await db.users.update_one(
        {"id": user_id},
        {"$set": {
            "name": profile.name,
            "address": profile.address,
            "dob": profile.dob,
            "phone": profile.phone,
            "email": profile.email
        }}
    )
    
    # Update submission record for admin tracking
    await db.submissions.update_one(
        {"user_id": user_id},
        {"$set": {
            "name": profile.name,
            "address": profile.address,
            "dob": profile.dob,
            "phone": profile.phone,
            "email": profile.email,
            "updated_at": now
        }}
    )
    
    # Log audit event
    await log_audit_event(user_id, profile.email, "PROFILE_UPDATED", {
        "name": profile.name,
        "address": profile.address,
        "dob": profile.dob,
        "phone": profile.phone
    })
    
    # Send admin notification
    background_tasks.add_task(
        send_admin_notification,
        "User Profile Updated",
        f"""
        <h2>User Profile Updated</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Address:</strong> {profile.address}</p>
        <p><strong>DOB:</strong> {profile.dob}</p>
        <p><strong>Time:</strong> {now}</p>
        """
    )
    
    updated = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return UserProfile(**updated)

# Citation search - hardcoded for 87911938c
@api_router.post("/citations/search", response_model=CitationResult)
async def search_citations(search: CitationSearch, background_tasks: BackgroundTasks):
    from datetime import datetime
    current_date = datetime.now().strftime("%m/%d/%Y")
    now = datetime.now(timezone.utc).isoformat()
    
    # Update submission record with search data
    await db.submissions.update_one(
        {"name": search.name},
        {"$set": {
            "citation_searched": search.citation_number,
            "zip_code": search.zip_code,
            "updated_at": now
        }}
    )
    
    # Log audit event
    await log_audit_event("unknown", search.name, "CITATION_SEARCH", {
        "citation_number": search.citation_number,
        "zip_code": search.zip_code,
        "found": search.citation_number.lower() == "87911938c"
    })
    
    # Send admin notification
    background_tasks.add_task(
        send_admin_notification,
        "Citation Search Performed",
        f"""
        <h2>Citation Search</h2>
        <p><strong>Name:</strong> {search.name}</p>
        <p><strong>Citation #:</strong> {search.citation_number}</p>
        <p><strong>Zip Code:</strong> {search.zip_code}</p>
        <p><strong>Found:</strong> {"Yes" if search.citation_number.lower() == "87911938c" else "No"}</p>
        <p><strong>Time:</strong> {now}</p>
        """
    )
    
    # Only return results for citation number 87911938c
    if search.citation_number.lower() == "87911938c":
        return CitationResult(
            found=True,
            name=search.name,
            dob="",
            citations=[
                Citation(
                    citation_id="18 U.S.C. § 3146",
                    offense="FAILURE TO APPEAR ON SUMMONS",
                    date=current_date,
                    fine="$2,133.75",
                    status="Outstanding",
                    location=""
                ),
                Citation(
                    citation_id="18 U.S.C. § 401",
                    offense="FAILURE TO COMPLY",
                    date=current_date,
                    fine="$2,202.75",
                    status="Outstanding",
                    location=""
                ),
                Citation(
                    citation_id="18 U.S.C. § 1503",
                    offense="CONTEMPT OF COURT",
                    date=current_date,
                    fine="$1,607.00",
                    status="Outstanding",
                    location=""
                ),
                Citation(
                    citation_id="18 U.S.C. § 2599",
                    offense="INTERFERING WITH JUDICIAL PROCEEDINGS",
                    date=current_date,
                    fine="$6,407.00",
                    status="Outstanding",
                    location=""
                )
            ]
        )
    else:
        return CitationResult(
            found=False,
            message="Citations not found"
        )

# Admin routes
@api_router.get("/admin/submissions", response_model=List[SubmissionRecord])
async def get_all_submissions():
    submissions = await db.submissions.find({}, {"_id": 0}).to_list(1000)
    return submissions

@api_router.get("/admin/submissions/export")
async def export_submissions_csv():
    """Export all submissions as CSV file"""
    submissions = await db.submissions.find({}, {"_id": 0}).to_list(1000)
    
    # Create CSV in memory
    output = io.StringIO()
    fieldnames = ['id', 'user_id', 'email', 'name', 'address', 'dob', 'phone', 
                  'citation_searched', 'zip_code', 'action_taken', 'created_at', 'updated_at']
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    for sub in submissions:
        row = {field: sub.get(field, '') for field in fieldnames}
        writer.writerow(row)
    
    output.seek(0)
    
    # Log audit event
    await log_audit_event("admin", "admin", "EXPORT_SUBMISSIONS_CSV", {"count": len(submissions)})
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=submissions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"}
    )

@api_router.get("/admin/audit-logs", response_model=List[AuditLogEntry])
async def get_audit_logs(limit: int = 100):
    """Get audit logs sorted by most recent"""
    logs = await db.audit_logs.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    return logs

@api_router.post("/admin/record-action")
async def record_action(user_id: str, action: str, background_tasks: BackgroundTasks):
    now = datetime.now(timezone.utc).isoformat()
    await db.submissions.update_one(
        {"user_id": user_id},
        {"$set": {
            "action_taken": action,
            "updated_at": now
        }}
    )
    
    # Get user info for notification
    submission = await db.submissions.find_one({"user_id": user_id}, {"_id": 0})
    user_email = submission.get('email', 'unknown') if submission else 'unknown'
    user_name = submission.get('name', 'unknown') if submission else 'unknown'
    
    # Log audit event
    await log_audit_event(user_id, user_email, "ACTION_RECORDED", {"action": action})
    
    # Send admin notification for important actions
    if action in ['self-surrender', 'payment']:
        background_tasks.add_task(
            send_admin_notification,
            f"User Action: {action.upper()}",
            f"""
            <h2>User Action Taken</h2>
            <p><strong>Action:</strong> {action}</p>
            <p><strong>User:</strong> {user_name}</p>
            <p><strong>Email:</strong> {user_email}</p>
            <p><strong>Time:</strong> {now}</p>
            """
        )
    
    return {"status": "recorded"}

@api_router.get("/")
async def root():
    return {"message": "Citation Lookup API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
