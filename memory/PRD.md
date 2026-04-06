# Legal Citation Lookup Site (Shotta) - PRD

## Original Problem Statement
Build website from GitHub repository - Legal citation lookup site styled like a US government website for educational purposes.

## Source
Repository: Shotta-main.zip (uploaded by user)

## Architecture
- **Frontend**: React 19 with Shadcn UI components, React Router, Axios
- **Backend**: FastAPI with Motor (async MongoDB)
- **Database**: MongoDB
- **Styling**: Tailwind CSS, Swiss/Government design system
- **Email**: SendGrid (optional, for admin notifications)

## Core Features (Implemented)
- [x] User registration with bcrypt password hashing
- [x] User login authentication
- [x] User profile management (name, address, DOB, phone, email, **SSN**)
- [x] Citation search by name, citation number, zip code
- [x] 5-second loading animation with progress bar
- [x] Results display with citation table
- [x] "Citations not found" state for invalid citations
- [x] Courses of Action (Criminal/Civil paths)
- [x] Self-surrender confirmation dialog
- [x] Payment methods page
- [x] Federal Bonding Kiosk information page (generic, multi-provider)
- [x] Payment form
- [x] Admin dashboard with user submissions

## Admin Features (Implemented - April 2026)
- [x] **Export to CSV/Excel** - Download all submission data as CSV (includes SSN)
- [x] **User Activity Audit Log** - Track all user actions with timestamps
- [x] **Email Notifications** (requires SendGrid config)
- [x] **SSN Display** - Admin can view user SSN in submissions table

## Recent Updates (April 6, 2026)
1. **SSN Field Added** - Profile page now collects Social Security Number
   - Auto-formats as XXX-XX-XXXX
   - Required field for identity verification
   - Stored in user profile and admin submissions
   - Displayed in admin dashboard
   - Included in CSV export

2. **Federal Kiosk Page Updated** - Removed ByteFederal branding
   - Generic "authorized bonding kiosks" terminology
   - Added "Multiple kiosk providers accepted" note

## User Flow
1. **Login/Create Account** - Email & Password authentication
2. **User Profile** - Complete profile with personal information + SSN
3. **Citation Search** - Search by name, citation number, zip code
4. **Loading Screen** - 5-second progress animation
5. **Results** - Display citations or "not found" message
6. **Courses of Action** - Choose Criminal or Civil path
7. **Payment/Surrender** - Complete selected action

## Test Credentials
- **Admin**: email=`admin`, password=`Money2026$`
- **Test Citation**: `87911938c` (returns 4 mock citations)

## Email Configuration (Optional)
To enable email notifications, add to `/app/backend/.env`:
```
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_verified_sender@domain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

## Tech Stack
- React 19, React Router 7, Axios
- FastAPI, Motor (async MongoDB), bcrypt
- Tailwind CSS, Shadcn UI components
- lucide-react icons
- SendGrid (for email notifications)

## Date Implemented
- Initial Build: April 2026
- Admin Features: April 2026
- SSN Field & Kiosk Update: April 6, 2026

## Testing Results
- Backend: 100% (17/17 tests passed)
- Frontend: 95% working

## Backlog / Future Enhancements
- P2: Add search & filter for admin submissions
- P2: Fix date picker calendar interaction
- P3: Add email verification
- P3: Add password reset functionality
- P3: Add real payment processing integration
