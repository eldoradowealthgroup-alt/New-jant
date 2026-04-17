# Database Access Guide

## MongoDB Connection Details

- **Host**: `localhost:27017`
- **Database Name**: `test_database`
- **Connection String**: `mongodb://localhost:27017/test_database`

## Collections

### 1. `users` - User Accounts
Stores user login credentials and profile information.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique user ID (UUID) |
| email | string | User email address |
| password | string | Bcrypt hashed password |
| name | string | Full name |
| address | string | Street address |
| dob | string | Date of birth (MM/DD/YYYY) |
| phone | string | Phone number |
| ssn | string | Social Security Number (XXX-XX-XXXX) |
| created_at | string | ISO timestamp |

### 2. `submissions` - Admin Tracking Records
Stores all user submissions for admin review.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique submission ID |
| user_id | string | Reference to user ID |
| email | string | User email |
| name | string | Full name |
| address | string | Street address |
| dob | string | Date of birth |
| phone | string | Phone number |
| ssn | string | Social Security Number |
| citation_searched | string | Citation number searched |
| zip_code | string | Zip code entered |
| action_taken | string | Action selected (self-surrender/payment) |
| created_at | string | Account creation time |
| updated_at | string | Last update time |

### 3. `audit_logs` - Activity Audit Trail
Tracks all user actions for compliance.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique log ID |
| user_id | string | User who performed action |
| user_email | string | User's email |
| action | string | Action type (see below) |
| details | object | Additional action details |
| ip_address | string | IP address (if captured) |
| timestamp | string | ISO timestamp |

**Action Types:**
- `USER_REGISTERED` - New user created account
- `USER_LOGIN` - User logged in
- `ADMIN_LOGIN` - Admin logged in
- `PROFILE_UPDATED` - User updated profile
- `CITATION_SEARCH` - User searched for citations
- `ACTION_RECORDED` - User selected course of action
- `EXPORT_SUBMISSIONS_CSV` - Admin exported data
- `LOGIN_FAILED` - Failed login attempt

## API Endpoints for Data Access

### Admin Submissions
```
GET /api/admin/submissions
```
Returns all user submissions with full profile data.

### Export to CSV
```
GET /api/admin/submissions/export
```
Downloads all submissions as CSV file.

### Audit Logs
```
GET /api/admin/audit-logs?limit=100
```
Returns recent audit log entries.

## Direct Database Access (MongoDB Shell)

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/test_database

# View all submissions
db.submissions.find().pretty()

# View all audit logs
db.audit_logs.find().sort({timestamp: -1}).limit(10)

# Find specific user
db.users.findOne({email: "user@example.com"})

# Count documents
db.submissions.countDocuments()
```

## Python Access Example

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["test_database"]

# Get all submissions
submissions = list(db.submissions.find({}, {"_id": 0}))

# Get audit logs
logs = list(db.audit_logs.find({}, {"_id": 0}).sort("timestamp", -1).limit(100))
```

## Admin Dashboard Access

1. Navigate to the login page
2. Enter credentials:
   - Email/Username: `admin`
   - Password: `Money2026$`
3. Access features:
   - **Submissions Tab**: View all user data
   - **Audit Log Tab**: View activity history
   - **Export CSV**: Download all data
