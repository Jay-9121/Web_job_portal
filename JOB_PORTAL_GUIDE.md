# Job Portal Integration Guide

## Overview
A complete job portal backend has been integrated with the frontend application. This includes job listings, job applications, company management, and a full application workflow.

---

## Backend Components

### 1. Controllers

#### **jobController.js**
Manages all job-related operations:
- `getAllJobs()` - Fetch all active jobs with filtering (search, location, jobType, experience, salary)
- `getJobById()` - Get detailed information for a specific job
- `createJob()` - Create a new job posting (company only)
- `updateJob()` - Update job details (company owner only)
- `deleteJob()` - Delete a job (company owner only)
- `closeJob()` - Mark a job as closed
- `getJobsByCompany()` - Get all jobs posted by a specific company
- `searchJobs()` - Advanced search with multiple filters

#### **applicationController.js**
Manages job applications:
- `submitApplication()` - Submit job application (user/job seeker only)
- `getApplicationsByJob()` - View applications for a specific job (company only)
- `getApplicationsByUser()` - View user's application history
- `getApplicationById()` - Get application details
- `updateApplicationStatus()` - Update application status (company only)
  - Statuses: applied, shortlisted, rejected, accepted, withdrawn
- `withdrawApplication()` - Withdraw application (job seeker only)
- `deleteApplication()` - Delete application
- `getApplicationStats()` - Get application statistics

#### **companyController.js**
Manages company profiles:
- `getAllCompanies()` - Get all companies
- `getCompanyById()` - Get company profile with recent jobs
- `createCompany()` - Create company profile
- `updateCompany()` - Update company information
- `getMyCompany()` - Get current user's company profile
- `deleteCompany()` - Delete company (admin only)
- `getCompanyStats()` - Get company statistics (jobs, applications)

### 2. Routes

#### **jobRoute.js** - `/api/jobs`
```
GET    /                  - Get all jobs (public)
GET    /search           - Search jobs (public)
GET    /:id              - Get job details (public)
POST   /                 - Create job (authenticated, company only)
PUT    /:id              - Update job (authenticated, owner only)
DELETE /:id              - Delete job (authenticated, owner only)
PATCH  /:id/close        - Close job (authenticated, owner only)
GET    /company/:id      - Get company jobs (public)
```

#### **applicationRoute.js** - `/api/applications`
```
POST   /submit           - Submit application (authenticated, user only)
GET    /user/:userId     - Get user applications (authenticated)
GET    /job/:jobId       - Get job applications (authenticated, company only)
GET    /:id              - Get application details (authenticated)
PATCH  /:id/status       - Update status (authenticated, company only)
PATCH  /:id/withdraw     - Withdraw application (authenticated)
DELETE /:id              - Delete application (authenticated)
GET    /stats/overview   - Get application stats (authenticated, company)
```

#### **companyRoute.js** - `/api/companies`
```
GET    /                 - Get all companies (public)
GET    /:id              - Get company profile (public)
POST   /                 - Create company (authenticated)
PUT    /:id              - Update company (authenticated, owner/admin)
GET    /profile/me       - Get my company (authenticated, company)
GET    /stats/overview   - Get company stats (authenticated, company)
DELETE /:id              - Delete company (authenticated, admin only)
```

### 3. Models

All models are in `Backend/models/`:

- **User** - Already exists with role: "user", "company", "admin"
- **Job** - Job postings with title, description, salary, location, type, skills, status
- **Application** - Job applications linking users to jobs
- **Company** - Company profiles linked to users

---

## Frontend Components

### 1. Pages Created

#### **Job Seeker Pages**

**JobsListing.jsx** (`/src/pages/jobs/JobsListing.jsx`)
- Browse all job listings
- Filter by: search term, location, job type, experience level
- Pagination support
- View job details button

**JobDetails.jsx** (`/src/pages/jobs/JobDetails.jsx`)
- Detailed job information
- Company information
- Required skills display
- Apply button with optional cover letter
- Apply for job functionality

**MyApplications.jsx** (`/src/pages/jobs/MyApplications.jsx`)
- View all submitted applications
- Filter by status: applied, shortlisted, accepted, rejected, withdrawn
- View cover letters
- Application timeline

#### **Company Pages**

**PostJob.jsx** (`/src/pages/company/PostJob.jsx`)
- Post a new job
- Fields: title, description, location, job type, experience level
- Set salary range
- Add required skills
- Set number of vacancies

**CompanyJobs.jsx** (`/src/pages/company/CompanyJobs.jsx`)
- View all posted jobs
- Job status indicator (active/closed)
- Quick actions: view, edit, manage applications
- Posted date information

**JobApplications.jsx** (`/src/pages/company/JobApplications.jsx`)
- View applications for specific job
- Filter applications by status
- Update application status (shortlist, accept, reject)
- Applicant details (name, email, phone, location)
- View cover letters
- Application statistics

### 2. API Service Methods

Added to `frontend/src/services/api.js`:

```javascript
// Jobs
getAllJobs(params)
searchJobs(params)
getJobById(id)
createJob(jobData)
updateJob(id, jobData)
deleteJob(id)
closeJob(id)
getJobsByCompany(companyId, params)

// Companies
getAllCompanies(params)
getCompanyById(id)
createCompany(companyData)
updateCompany(id, companyData)
getMyCompany()
getCompanyStats()
deleteCompany(id)

// Applications
submitApplication(applicationData)
getApplicationsByJob(jobId, params)
getApplicationsByUser(userId, params)
getApplicationById(id)
updateApplicationStatus(id, status)
withdrawApplication(id)
deleteApplication(id)
getApplicationStats()
```

---

## Routing Setup (Example Implementation)

To use these pages in your App.jsx, add these routes:

```jsx
import { JobsListing, JobDetails, MyApplications } from "./pages/jobs";
import { PostJob, CompanyJobs, JobApplications } from "./pages/company";

// In your router configuration:
<Route path="/jobs" element={<JobsListing />} />
<Route path="/jobs/:jobId" element={<JobDetails />} />
<Route path="/my-applications" element={<MyApplications />} />

<Route path="/company/post-job" element={<PostJob />} />
<Route path="/company/jobs" element={<CompanyJobs />} />
<Route path="/company/job/:jobId/applications" element={<JobApplications />} />
```

---

## User Roles & Permissions

### 1. Job Seeker (role: "user")
- ✅ Browse jobs
- ✅ Search and filter jobs
- ✅ Apply for jobs
- ✅ Submit cover letter
- ✅ View application status
- ✅ Withdraw application
- ❌ Post jobs
- ❌ Manage applications

### 2. Company (role: "company")
- ✅ Post jobs
- ✅ Edit own jobs
- ✅ Close jobs
- ✅ View received applications
- ✅ Update application status (shortlist, accept, reject)
- ✅ View company statistics
- ❌ Apply for jobs

### 3. Admin (role: "admin")
- ✅ All company permissions
- ✅ All job seeker permissions
- ✅ Delete companies
- ✅ Delete jobs
- ✅ Delete applications
- ✅ Manage users

---

## Environment Configuration

Ensure your `.env` file has these variables configured:

```env
# Database
DB_NAME=job_portal_db
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=5432

# Server
NODE_ENV=development
PORT=3000

# Admin (for auto-creation)
ADMIN_EMAIL=admin@local.test
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Administrator
```

---

## Database Models Summary

### User Table
- id, username, email, password (hashed), phoneNumber, location, bio
- role (enum: user, admin, company)
- createdAt, updatedAt

### Company Table
- id, userId (FK to User), companyName, email, description
- location, logo, website, industry, companySize
- createdAt, updatedAt

### Job Table
- id, companyId (FK to Company), title, description, salaryRange
- location, jobType (enum), skillsRequired (JSON array)
- experienceLevel, vacancies, status (enum: active, closed, draft)
- createdAt, updatedAt

### Application Table
- id, userId (FK to User), jobId (FK to Job), coverLetter
- status (enum: applied, shortlisted, rejected, accepted, withdrawn)
- createdAt, updatedAt

---

## Workflow Examples

### Job Seeker Workflow:
1. Browse jobs on `/jobs`
2. Search/filter jobs by criteria
3. Click "View Details" to see job details
4. Click "Apply Now" and submit application
5. View all applications on `/my-applications`
6. Can withdraw application if still in "applied" status

### Company Workflow:
1. Post new job at `/company/post-job`
2. View all posted jobs at `/company/jobs`
3. Click "Applications" to view job applicants
4. Update application status: shortlist → accept (or reject)
5. View company statistics

---

## Testing the Integration

### Manual Testing Checklist:

**Job Seeker:**
- [ ] Can browse all jobs
- [ ] Can search/filter jobs
- [ ] Can view job details
- [ ] Can apply for job with/without cover letter
- [ ] Can view own applications
- [ ] Can withdraw application
- [ ] Cannot access company pages

**Company:**
- [ ] Can create company profile
- [ ] Can post new job
- [ ] Can view posted jobs
- [ ] Can view applications for each job
- [ ] Can update application status
- [ ] Cannot apply for jobs

**Admin:**
- [ ] Can access all features
- [ ] Can delete companies, jobs, applications
- [ ] Can manage user roles

---

## API Response Format

All endpoints follow this format:

```json
{
  "success": true/false,
  "message": "Operation result message",
  "data": {
    // Response data
  },
  "error": "Error message (if success: false)"
}
```

---

## Security Features Implemented

1. **Authentication**: All modifying operations require JWT token
2. **Authorization**: Role-based access control (user, company, admin)
3. **Ownership Validation**: Users can only modify their own data
4. **Data Validation**: Input validation on all endpoints
5. **Error Handling**: Comprehensive error messages

---

## Future Enhancements

- Email notifications for application status changes
- Resume upload functionality
- Advanced job recommendations
- Saved jobs feature
- Job analytics and reports
- Payment integration for featured job postings
- Video interviews integration
- Assessment tools

---

## Support

For issues or questions about the implementation, refer to:
- Backend: `Backend/` directory
- Frontend: `frontend/src/` directory
- Models: `Backend/models/`
- Controllers: `Backend/controllers/`
- Routes: `Backend/routes/`

---

**Job Portal Backend & Frontend Integration Complete! 🎉**
