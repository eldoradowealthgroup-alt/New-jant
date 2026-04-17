# Migration Guide - Hosting This Application Elsewhere

## What's Included

This application has two parts:
1. **Frontend** (React) - Static files in `/frontend/build/`
2. **Backend** (FastAPI + MongoDB) - Python server in `/backend/`

---

## Option 1: Frontend Only (Static Hosting)

If you only want to host the frontend (no backend functionality):

### Platforms: GitHub Pages, Netlify, Vercel, AWS S3, etc.

1. Copy the entire `/frontend/build/` folder
2. Deploy to your static hosting platform
3. The site will display but API calls will fail

**Limitations:**
- No user registration/login
- No data storage
- Display-only mode

---

## Option 2: Full Stack Deployment

### Requirements:
- Node.js 18+ (for building frontend)
- Python 3.9+ (for backend)
- MongoDB database

### Step 1: Set Up MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Create account at https://www.mongodb.com/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

**Option B: Self-hosted MongoDB**
1. Install MongoDB on your server
2. Connection string: `mongodb://localhost:27017`

### Step 2: Configure Backend

1. Copy `/backend/` folder to your server
2. Create/edit `.env` file:

```env
MONGO_URL=mongodb+srv://your-connection-string
DB_NAME=citation_lookup
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Step 3: Configure Frontend

1. Edit `/frontend/.env` before building:

```env
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

2. Build the frontend:
```bash
cd frontend
npm install  # or yarn install
npm run build  # or yarn build
```

3. Deploy the `/frontend/build/` folder to your hosting

---

## Deployment Platform Examples

### Vercel (Frontend)
```bash
cd frontend
vercel deploy
```

### Railway (Full Stack)
1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables in Railway dashboard
4. Deploy both frontend and backend services

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build commands:
   - Frontend: `cd frontend && npm run build`
   - Backend: `cd backend && pip install -r requirements.txt`
3. Set environment variables
4. Deploy

### AWS (EC2 + S3)
1. Frontend → S3 bucket with static hosting
2. Backend → EC2 instance with Python
3. MongoDB → MongoDB Atlas or DocumentDB

---

## Environment Variables Reference

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017  # Your MongoDB connection
DB_NAME=citation_lookup              # Database name

# Optional: Email notifications
SENDGRID_API_KEY=your_key
SENDER_EMAIL=noreply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://your-api-domain.com
```

---

## File Structure for Deployment

```
your-deployment/
├── frontend/
│   └── build/           # Deploy this folder for static hosting
│       ├── index.html
│       ├── static/
│       │   ├── js/
│       │   └── css/
│       └── images/      # Local images (no external dependencies)
│
└── backend/
    ├── server.py        # Main FastAPI application
    ├── requirements.txt # Python dependencies
    └── .env             # Environment configuration
```

---

## Verification Checklist

After deployment, verify:

- [ ] Login page loads at root URL
- [ ] Can create new account
- [ ] Profile page works with DOB picker
- [ ] Citation search works (test with: 87911938c)
- [ ] Admin login works (admin / Money2026$)
- [ ] Images display correctly (header, footer, kiosk page)
- [ ] No console errors about external URLs

---

## Troubleshooting

**API calls failing:**
- Check REACT_APP_BACKEND_URL is correct
- Ensure backend is running and accessible
- Check CORS settings in server.py

**Images not loading:**
- Images are now local in `/build/images/`
- No external dependencies on emergentagent.com

**MongoDB connection issues:**
- Verify MONGO_URL is correct
- Check network/firewall allows connection
- Ensure database user has read/write permissions

---

## Admin Credentials

- **Username:** admin
- **Password:** Money2026$

## Test Citation Number

Use `87911938c` to see sample results
