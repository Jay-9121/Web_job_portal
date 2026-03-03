# Quick Start Guide - Job Portal

## 🚀 Start Backend Server

```bash
cd Web-development-project-example/Backend
npm start
```

**Server runs on:** `http://localhost:3000`
**API Base URL:** `http://localhost:3000/api`

## 🚀 Start Frontend Server

```bash
cd Web-development-project-example/frontend
npm run dev
```

**Application runs on:** `http://localhost:5173`

---

## 🎯 Key Features Implemented

### 1. **Advanced Job Search & Filtering**
- Search by job title, description, location
- Filter by job type (Full-time, Part-time, Contract, Internship, Freelance)
- Filter by experience level (Entry, Mid, Senior, Lead, Executive)
- Salary range filtering
- Toggle filter visibility
- Clear filters button

### 2. **Enhanced Job Details Page**
- Two-column responsive layout
- Sticky application form sidebar
- Company branding and logo
- Required skills display
- Company information card
- Professional styling

### 3. **Improved Application Management**
- View all your applications
- Filter by status (All, Applied, Shortlisted, Accepted, Rejected, Withdrawn)
- Sort by date or job title
- View cover letters
- Application timeline
- Quick actions

### 4. **Better User Experience**
- Loading skeleton animations
- Error messages with details
- Responsive design
- Professional color scheme
- Better typography and spacing
- Hover effects and transitions

---

## 📊 All Data from Backend

✅ No hardcoded data in frontend  
✅ All data fetched from REST API  
✅ Proper error handling  
✅ JWT authentication  
✅ Loading states  

---

## 🔌 Main API Endpoints

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/search` - Search with filters
- `GET /api/jobs/:id` - Get job details

### Applications
- `POST /api/applications/submit` - Submit application
- `GET /api/applications/user/:userId` - Get user's applications
- `PATCH /api/applications/:id/status` - Update status

### Companies
- `GET /api/companies` - List companies
- `GET /api/companies/:id` - Get company details

---

## 📁 Modified Files

### Backend
- `Backend/controllers/venueController.js` - Removed Dish references
- `Backend/index.js` - Removed unnecessary routes
- `Backend/.env` - Added email credentials

### Frontend
- `frontend/src/pages/jobs/JobsListing.jsx` - Complete redesign
- `frontend/src/pages/jobs/JobDetails.jsx` - Professional layout
- `frontend/src/pages/jobs/MyApplications.jsx` - Advanced features

---

## 🐛 Database Setup

Make sure PostgreSQL is running and `.env` contains:

```
DB_NAME=JobPortal
DB_USER=postgres
DB_PASS=root
DB_HOST=localhost
DB_PORT=5432
```

---

## 📝 Frontend Filter Parameters

### JobsListing Filters
```
- search: Search by title/description
- location: Filter by location
- jobType: full-time, part-time, contract, internship, freelance
- experience: entry, mid, senior, lead, executive
- minSalary: Minimum salary
- maxSalary: Maximum salary
```

### MyApplications Filters
```
- All Status / Applied / Shortlisted / Accepted / Rejected / Withdrawn
- Sort: Recent / Oldest / Title (A-Z)
```

---

## ✨ UI Improvements

- 🎨 Modern gradient backgrounds
- 🏷️ Color-coded badges (status, job type, location)
- 📱 Fully responsive design
- ⏳ Loading animations
- 🔔 Status indicators with icons
- 📊 Result counters
- 🔍 Toggle filter visibility

---

## 🔒 Authentication

All protected endpoints require Bearer token:
```
Header: Authorization: Bearer <your_jwt_token>
```

---

## 📚 For More Details

See `IMPROVEMENTS_SUMMARY.md` for comprehensive documentation of all changes, features, and improvements.
