# U.S. District Lookup - Citation Search System

A government-styled legal citation lookup web application built with React and FastAPI.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Quick Start](#quick-start)
6. [Configuration](#configuration)
7. [Valid Citation Numbers](#valid-citation-numbers)
8. [Admin Access](#admin-access)
9. [User Flow](#user-flow)
10. [Database Schema](#database-schema)
11. [API Endpoints](#api-endpoints)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## Overview

This application simulates a U.S. District Court citation lookup system. Users can create accounts, enter their profile information, search for citations, and view payment options.

**Live Preview:** The application starts on the login page where users can sign in or create a new account.

---

## Features

### User Features
- User registration and authentication
- Profile management (name, address, DOB, phone, SSN)
- Citation search by citation number
- View violation details and fines
- Multiple payment method options
- Federal Bonding Kiosk information

### Admin Features
- View all user submissions
- Export data to CSV
- Activity audit log
- Email notifications (optional)

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19, Tailwind CSS, Shadcn UI |
| Backend | FastAPI (Python) |
| Database | MongoDB |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## Project Structure

```
/app
├── frontend/
│   ├── build/              # Production build (deploy this)
│   ├── public/
│   │   └── images/         # Local images
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app with routing
│   │   ├── App.css         # Global styles
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── .env                # Frontend environment variables
│
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment variables
│
├── README.md               # This file
├── MIGRATION_GUIDE.md      # Deployment instructions
└── DATABASE_ACCESS.md      # Database documentation
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install
# or: npm install

# Configure environment
# Edit .env with your backend URL

# Development mode
yarn start

# Production build
yarn build
```

---

## Configuration

### Backend Environment Variables (`backend/.env`)

```env
# MongoDB Connection (Required)
MONGO_URL=mongodb://localhost:27017
DB_NAME=citation_lookup

# Email Notifications (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=noreply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

### Frontend Environment Variables (`frontend/.env`)

```env
# Backend API URL (Required)
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## Valid Citation Numbers

The system recognizes three citation numbers, each returning different fine amounts:

### Citation: `87911938c`
| Violation | Fine |
|-----------|------|
| FAILURE TO APPEAR ON SUMMONS | $2,133.75 |
| FAILURE TO COMPLY | $2,202.75 |
| CONTEMPT OF COURT | $1,607.00 |
| INTERFERING WITH JUDICIAL PROCEEDINGS | $6,407.00 |
| **Total** | **$12,350.50** |

### Citation: `5998563f`
| Violation | Fine |
|-----------|------|
| FAILURE TO APPEAR ON SUMMONS | $586.72 |
| FAILURE TO COMPLY | $1,943.09 |
| CONTEMPT OF COURT | $1,413.80 |
| INTERFERING WITH JUDICIAL PROCEEDINGS | $5,293.39 |
| **Total** | **$9,237.00** |

### Citation: `6339179c`
| Violation | Fine |
|-----------|------|
| FAILURE TO APPEAR ON SUMMONS | $1,165.42 |
| FAILURE TO COMPLY | $436.21 |
| CONTEMPT OF COURT | $1,121.53 |
| INTERFERING WITH JUDICIAL PROCEEDINGS | $852.84 |
| **Total** | **$3,576.00** |

Any other citation number will return "Citations not found".

---

## Admin Access

### Login Credentials
```
Username: admin
Password: Money2026$
```

### Admin Dashboard Features

1. **Submissions Tab**
   - View all user registrations
   - See profile data (name, email, SSN, DOB, phone, address)
   - View citation searches performed
   - Track actions taken by users

2. **Audit Log Tab**
   - Track all user activities
   - Timestamped action history
   - User identification

3. **Export CSV**
   - Download all submission data
   - Includes all user fields

---

## User Flow

```
1. LOGIN PAGE
   └── Sign in or Create Account

2. CREATE ACCOUNT
   └── Enter email and password

3. USER PROFILE
   └── Enter: Name, Address, DOB, Phone, Email, SSN

4. CITATION SEARCH
   └── Enter: Name, Citation Number, Zip Code

5. LOADING SCREEN
   └── 5-second progress animation

6. RESULTS PAGE
   └── View violations and fines
   └── Options: View Courses of Action | Proceed to Payment

7. COURSES OF ACTION
   ├── Criminal: Self-Surrender
   └── Civil: Payment Options

8. PAYMENT METHODS
   ├── Debit/Credit Cards
   ├── Federal Bonding Kiosk
   └── LOGOUT button
```

---

## Database Schema

### Collections

#### `users`
```javascript
{
  id: "uuid",
  email: "user@example.com",
  password: "bcrypt_hash",
  name: "John Doe",
  address: "123 Main St",
  dob: "01/15/1990",
  phone: "555-123-4567",
  ssn: "123-45-6789",
  created_at: "ISO_timestamp"
}
```

#### `submissions`
```javascript
{
  id: "uuid",
  user_id: "user_uuid",
  email: "user@example.com",
  name: "John Doe",
  address: "123 Main St",
  dob: "01/15/1990",
  phone: "555-123-4567",
  ssn: "123-45-6789",
  citation_searched: "87911938c",
  zip_code: "12345",
  action_taken: "payment",
  created_at: "ISO_timestamp",
  updated_at: "ISO_timestamp"
}
```

#### `audit_logs`
```javascript
{
  id: "uuid",
  user_id: "user_uuid",
  user_email: "user@example.com",
  action: "USER_REGISTERED",
  details: {},
  timestamp: "ISO_timestamp"
}
```

### Action Types
- `USER_REGISTERED` - New account created
- `USER_LOGIN` - User logged in
- `ADMIN_LOGIN` - Admin logged in
- `PROFILE_UPDATED` - Profile information changed
- `CITATION_SEARCH` - Citation lookup performed
- `ACTION_RECORDED` - User selected course of action
- `EXPORT_SUBMISSIONS_CSV` - Admin exported data

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | User login |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/{user_id}` | Get user profile |
| PUT | `/api/profile/{user_id}` | Update profile |

### Citations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/citations/search` | Search for citations |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/submissions` | Get all submissions |
| GET | `/api/admin/submissions/export` | Download CSV |
| GET | `/api/admin/audit-logs` | Get audit logs |
| POST | `/api/admin/record-action` | Record user action |

---

## Deployment

### Option 1: Static Frontend Only

Deploy the `frontend/build/` folder to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

**Note:** API functionality requires a running backend.

### Option 2: Full Stack

See `MIGRATION_GUIDE.md` for detailed instructions on deploying to:
- Railway
- DigitalOcean
- AWS
- Heroku

### Quick Deploy Steps

1. Set up MongoDB (Atlas recommended)
2. Deploy backend with environment variables
3. Update frontend `.env` with backend URL
4. Build frontend: `yarn build`
5. Deploy `frontend/build/` folder

---

## Troubleshooting

### Common Issues

**Backend won't start**
```bash
# Check if port 8001 is in use
lsof -i :8001

# Check MongoDB connection
mongosh mongodb://localhost:27017
```

**Frontend build fails**
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn build
```

**API calls failing**
- Verify `REACT_APP_BACKEND_URL` is correct
- Check CORS settings in `server.py`
- Ensure backend is running and accessible

**Images not loading**
- Images are stored locally in `/frontend/build/images/`
- No external dependencies required

**Login issues**
- Admin credentials: `admin` / `Money2026$`
- Regular users: Use the email/password created during registration

---

## Support Files

- `MIGRATION_GUIDE.md` - Detailed deployment instructions
- `DATABASE_ACCESS.md` - Database connection and query examples

---

## License

This project is for educational and demonstration purposes.
