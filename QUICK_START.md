# Job Portal - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation & Setup

#### 1. Backend Setup

```bash
cd Backend
npm install
```

#### 2. Environment Configuration

Create a `.env` file in the `Backend/` directory:

```env
# Database Configuration
DB_NAME=job_portal_db
DB_USER=postgres
DB_PASS=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
NODE_ENV=development
PORT=3000

# Admin User (Auto-created in development)
ADMIN_EMAIL=admin@local.test
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Administrator

# JWT Secret (if needed)
JWT_SECRET=your_jwt_secret_key_here
```

#### 3. Start Backend Server

```bash
npm start
# Server runs on http://localhost:3000
```

The backend will automatically:
- Connect to PostgreSQL
- Create database tables
- Create an admin user (in development)

#### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📋 Available Endpoints

### Job Endpoints
```
GET    /api/jobs                 - Get all jobs
GET    /api/jobs/search          - Search jobs with filters
GET    /api/jobs/:id             - Get job details
POST   /api/jobs                 - Create job (company only)
PUT    /api/jobs/:id             - Update job (owner only)
DELETE /api/jobs/:id             - Delete job (owner only)
PATCH  /api/jobs/:id/close       - Close job (owner only)
GET    /api/jobs/company/:id     - Get company's jobs
```

### Application Endpoints
```
POST   /api/applications/submit  - Submit job application
GET    /api/applications/user/:userId - Get user applications
GET    /api/applications/job/:jobId - Get job applications (company)
GET    /api/applications/:id     - Get application details
PATCH  /api/applications/:id/status - Update application status
PATCH  /api/applications/:id/withdraw - Withdraw application
DELETE /api/applications/:id     - Delete application
```

### Company Endpoints
```
GET    /api/companies            - Get all companies
GET    /api/companies/:id        - Get company details
POST   /api/companies            - Create company profile
PUT    /api/companies/:id        - Update company (owner only)
GET    /api/companies/profile/me - Get my company profile
GET    /api/companies/stats/overview - Get company statistics
```

---

## 🔐 User Roles & Access

### Job Seeker (role: "user")
1. Sign up as regular user
2. Browse and search jobs
3. Apply for jobs
4. Track application status
5. Withdraw applications

### Company (role: "company")
1. Sign up/create company profile
2. Post job listings
3. View received applications
4. Update application status
5. Track job statistics

### Admin (role: "admin")
- Access to all features
- Can manage companies, jobs, and applications
- Can delete any resource

---

## 🔄 Typical User Flows

### Flow 1: Job Seeker Applies for Job
```
1. User signs up → role: "user"
2. Browse jobs: GET /api/jobs
3. View job details: GET /api/jobs/:id
4. Apply for job: POST /api/applications/submit
5. Check status: GET /api/applications/user/:userId
```

### Flow 2: Company Posts Job
```
1. Company signs up → role: "company"
2. Create company profile: POST /api/companies
3. Post job: POST /api/jobs
4. View applications: GET /api/applications/job/:jobId
5. Update status: PATCH /api/applications/:id/status
```

---

## 📁 Project Structure

```
Backend/
├── controllers/
│   ├── jobController.js
│   ├── applicationController.js
│   ├── companyController.js
│   └── ...
├── models/
│   ├── jobModel.js
│   ├── applicationModel.js
│   ├── companyModel.js
│   └── ...
├── routes/
│   ├── jobRoute.js
│   ├── applicationRoute.js
│   ├── companyRoute.js
│   └── ...
├── helpers/
│   ├── authguagrd.js
│   ├── isAdmin.js
│   └── ...
├── database/
│   └── db.js
└── index.js

frontend/
├── src/
│   ├── pages/
│   │   ├── jobs/
│   │   │   ├── JobsListing.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   └── MyApplications.jsx
│   │   ├── company/
│   │   │   ├── PostJob.jsx
│   │   │   ├── CompanyJobs.jsx
│   │   │   └── JobApplications.jsx
│   │   └── ...
│   ├── services/
│   │   └── api.js
│   └── ...
└── ...
```

---

## 🧪 Testing

### Create Test User (Job Seeker)
```json
POST /api/user/user
{
  "username": "john_seeker",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "location": "New York"
}
```

### Create Test Company
```json
POST /api/user/user
{
  "username": "tech_company",
  "email": "company@techcorp.com",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```
Then update user role to "company" in database.

### Create Company Profile
```json
POST /api/companies
{
  "companyName": "Tech Corp",
  "email": "company@techcorp.com",
  "description": "Leading tech company",
  "location": "San Francisco",
  "website": "https://techcorp.com",
  "industry": "Technology",
  "companySize": "51-200"
}
```

### Post a Job
```json
POST /api/jobs
{
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "location": "San Francisco",
  "jobType": "full-time",
  "skillsRequired": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "senior",
  "minSalary": 100000,
  "maxSalary": 150000,
  "vacancies": 2
}
```

### Apply for Job
```json
POST /api/applications/submit
{
  "jobId": 1,
  "coverLetter": "I am very interested in this position..."
}
```

---

## 🛠️ Database Setup

If using PostgreSQL manually:

```sql
CREATE DATABASE job_portal_db;
```

The application will create all tables automatically on first run.

---

## 📝 Important Notes

1. **Authentication**: Include Bearer token in Authorization header for authenticated requests
   ```
   Authorization: Bearer <your_token>
   ```

2. **CORS**: Frontend origins configured: `http://localhost:5173`, `http://localhost:5174`

3. **Database Sync**: Uses `sequelize.sync({ force: true })` - drops and recreates tables on restart (development only)

4. **File Uploads**: If needed, uploads folder is served at `/uploads`

---

## 🐛 Common Issues & Solutions

### Issue: Cannot connect to database
**Solution**: Check PostgreSQL is running and .env credentials are correct

### Issue: Tables not created
**Solution**: Ensure database exists and Node process completes startup

### Issue: CORS errors
**Solution**: Check frontend URL is in CORS allowlist in backend index.js

### Issue: Authentication failures
**Solution**: Ensure JWT token is valid and in Authorization header

---

## 📚 API Documentation

Full API documentation available in `JOB_PORTAL_GUIDE.md`

---

## ✅ Checklist Before Production

- [ ] Update `.env` with production database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS origins for production frontend URL
- [ ] Change JWT secret to strong random string
- [ ] Set secure admin password
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up logging
- [ ] Configure email service for notifications
- [ ] Run security audit

---

## 🎯 Next Steps

1. Import pages into your main App.jsx router
2. Set up authentication (login/signup) if not already done
3. Create navigation menu for job portal features
4. Customize styling as needed
5. Test all user flows
6. Deploy to production

---

**Need Help?** Refer to the detailed guide in `JOB_PORTAL_GUIDE.md`
