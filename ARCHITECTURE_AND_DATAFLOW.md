# Job Portal - Architecture & Data Flow

## 📊 Component Data Flow Architecture

```
Frontend → API Service → Backend API → Database
   ↓
 React Components (Pages)
   ↓
 State Management (useState, useEffect)
   ↓
 API Calls via axios
   ↓
 Data Display & Rendering
```

---

## 🏗️ Component Structure

### JobsListing Component Flow

```
JobsListing
├── State
│   ├── jobs (array)
│   ├── loading (boolean)
│   ├── error (string)
│   ├── filters (search, location, jobType, experience, minSalary, maxSalary)
│   ├── pagination (page, limit, totalPages)
│   └── showFilters (toggle)
│
├── Effects
│   └── useEffect (depends on: pagination.page, filters)
│
├── API Calls
│   ├── getAllJobs(params) - GET /api/jobs
│   └── searchJobs(params) - GET /api/jobs/search
│
├── UI Sections
│   ├── Header with toggle filters button
│   ├── Filter section (toggle-able)
│   ├── Results count
│   ├── Loading skeleton OR
│   ├── Jobs list (maps over jobs)
│   └── Pagination controls
│
└── User Actions
    ├── Filter change → Reset pagination
    ├── Clear filters → Reset all
    └── View Details → Navigate to JobDetails
```

### JobDetails Component Flow

```
JobDetails
├── State
│   ├── job (object)
│   ├── loading (boolean)
│   ├── error (string)
│   ├── user (object)
│   ├── coverLetter (string)
│   ├── applying (boolean)
│   ├── applied (boolean)
│   └── successMessage (string)
│
├── Effects
│   ├── useEffect (fetch job details)
│   └── useEffect (fetch user info)
│
├── API Calls
│   ├── getJobById(jobId) - GET /api/jobs/:id
│   ├── getMe() - GET /api/user/me
│   └── submitApplication(data) - POST /api/applications/submit
│
├── UI Sections
│   ├── Back button
│   ├── Loading skeleton OR
│   ├── Error display OR
│   ├── Main Content (2-column layout)
│   │   ├── Left Column (70%)
│   │   │   ├── Job header with company logo
│   │   │   ├── Quick info grid
│   │   │   ├── Job description
│   │   │   ├── Required skills
│   │   │   └── Company info card
│   │   └── Right Column (30%) - Sticky
│   │       ├── Application form (if status=active)
│   │       ├── Success message (if applied)
│   │       ├── Login prompt (if not authenticated)
│   │       └── Closed status (if status!=active)
│
└── User Actions
    ├── Submit cover letter → POST application
    ├── View company profile
    ├── Go back to jobs
    └── Login (if not authenticated)
```

### MyApplications Component Flow

```
MyApplications
├── State
│   ├── applications (array)
│   ├── loading (boolean)
│   ├── error (string)
│   ├── user (object)
│   ├── filterStatus (string: all/applied/shortlisted/accepted/rejected/withdrawn)
│   └── sortBy (string: recent/oldest/title)
│
├── Effects
│   └── useEffect (fetch user and applications)
│
├── API Calls
│   ├── getMe() - GET /api/user/me
│   └── getApplicationsByUser(userId) - GET /api/applications/user/:userId
│
├── Data Processing
│   ├── Filter applications by status
│   └── Sort by date or title
│
├── UI Sections
│   ├── Header with Browse Jobs button
│   ├── Filter & Sort Section
│   │   ├── Status filter dropdown (with counts)
│   │   ├── Sort dropdown
│   │   └── Results count
│   ├── Loading skeleton OR
│   ├── Empty state OR
│   ├── Applications list
│   │   └── For each application:
│   │       ├── Job title
│   │       ├── Company name
│   │       ├── Status badge
│   │       ├── Job details (type, location, salary)
│   │       ├── Application date
│   │       ├── Cover letter (expandable)
│   │       └── Action buttons
│
└── User Actions
    ├── Filter by status
    ├── Sort applications
    ├── View cover letter
    ├── View job details
    ├── View company profile
    └── Browse more jobs
```

---

## 🔌 API Endpoints Used

### In JobsListing
```
GET /api/jobs?page=1&limit=10 (with optional params: search, location, jobType, experience, minSalary, maxSalary)
GET /api/jobs/search?search=...&location=...&minSalary=...&maxSalary=...
```

### In JobDetails
```
GET /api/jobs/:jobId
GET /api/user/me
POST /api/applications/submit (body: { jobId, coverLetter })
```

### In MyApplications
```
GET /api/user/me
GET /api/applications/user/:userId
```

---

## 📦 Data Models

### Job Object (from API)
```javascript
{
  id: number,
  title: string,
  description: string,
  location: string,
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance',
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive',
  salaryRange: string (e.g., "$50,000 - $80,000"),
  minSalary: number,
  maxSalary: number,
  vacancies: number,
  skillsRequired: string[],
  status: 'active' | 'closed',
  createdAt: timestamp,
  updatedAt: timestamp,
  Company: {
    id: number,
    name: string,
    logo: string,
    location: string,
    website: string,
    description: string
  }
}
```

### Application Object (from API)
```javascript
{
  id: number,
  jobId: number,
  userId: number,
  status: 'applied' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn',
  coverLetter: string | null,
  createdAt: timestamp,
  updatedAt: timestamp,
  Job: { /* Job object */ },
  User: { /* User object */ }
}
```

### User Object (from API)
```javascript
{
  id: number,
  username: string,
  email: string,
  role: 'user' | 'company' | 'admin',
  phoneNumber: string,
  profilePicture: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔄 Authentication Flow

1. **User logs in** → Gets JWT token
2. **Token stored** in localStorage
3. **API interceptor** adds token to all requests:
   ```javascript
   Authorization: Bearer <token>
   ```
4. **Protected endpoints** verify token
5. **401 response** → Redirect to login

---

## 🎯 State Management Flow

```
User Action
    ↓
Update Local State (setState)
    ↓
Trigger useEffect (if dependencies change)
    ↓
API Call (GET/POST/PUT/PATCH/DELETE)
    ↓
Update Response State
    ↓
Re-render Component
    ↓
Display Updated Data
```

---

## 🐛 Error Handling Flow

```
API Call
    ↓
Response
├── Success (200-299)
│   └── Update state with data
├── Client Error (400-499)
│   └── Show error message to user
└── Server Error (500+)
    └── Show generic error + logs

Error States:
├── Loading error → Show message
├── Data null → Show "not found"
├── Network error → Show connection message
└── Auth error → Redirect to login
```

---

## 🎨 Filter Flow Diagram

```
User Types Filter Value
    ↓
onChange Handler triggered
    ↓
setFilters (state updated)
    ↓
useEffect triggered (filters dependency)
    ↓
Reset pagination to page 1
    ↓
Check if any filter active
    ├── Yes → Call searchJobs with params
    └── No → Call getAllJobs
    ↓
Set loading = true
    ↓
API Response received
    ↓
Update jobs state
    ↓
Update pagination (totalPages, total)
    ↓
Set loading = false
    ↓
Component re-renders with new data
```

---

## 🔍 Search vs List Flow

```
No Active Filters
    └── GET /api/jobs?page=1&limit=10
        └── Returns: All active jobs

Any Active Filter
    └── GET /api/jobs/search?search=...&location=...&...
        └── Returns: Filtered jobs

Query Parameters:
├── page: Current page number
├── limit: Items per page
├── search: Search term
├── location: Location filter
├── jobType: Job type filter
├── experience: Experience level filter
├── minSalary: Minimum salary
└── maxSalary: Maximum salary
```

---

## 📱 Responsive Layout

### JobDetails Two-Column Layout
```
Desktop (lg)          Tablet (md)         Mobile (sm)
┌──────────┐         ┌──────────┐        ┌────────┐
│  Main    │         │  Main    │        │ Main   │
│ Content  │         │ Content  │        │Content │
│  (70%)   │         │  (100%)  │        │(100%) │
│          │         │          │        │       │
│          │         │          │        │       │
├──────────┤         ├──────────┤        ├────────┤
│  Form    │         │  Form    │        │ Form   │
│  (30%)   │         │  (100%)  │        │(100%) │
│ (Sticky) │         │  (Below) │        │(Below)│
└──────────┘         └──────────┘        └────────┘
```

---

## 🚀 Performance Optimizations

1. **Pagination** - Load 10 items per page
2. **Skeleton Loading** - Show placeholders while loading
3. **Conditional Rendering** - Only render visible components
4. **Error Boundaries** - Catch and handle errors gracefully
5. **Lazy Loading** - Expandable cover letters
6. **useEffect Dependencies** - Only trigger when necessary

---

## 🧪 Testing Endpoints

```bash
# Test Job Listing
curl http://localhost:3000/api/jobs

# Test Job Search
curl "http://localhost:3000/api/jobs/search?search=developer"

# Test Get Job Details
curl http://localhost:3000/api/jobs/1

# Test Get Applications (requires token)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/applications/user/1

# Test Submit Application (requires token)
curl -X POST http://localhost:3000/api/applications/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"jobId":1,"coverLetter":"I am interested in this position"}'
```

---

## 📋 Complete Request/Response Examples

### Get All Jobs Request
```http
GET /api/jobs?page=1&limit=10 HTTP/1.1
Host: localhost:3000
```

### Get All Jobs Response
```json
{
  "success": true,
  "jobs": [
    {
      "id": 1,
      "title": "Senior React Developer",
      "description": "...",
      "location": "Remote",
      "jobType": "full-time",
      "experienceLevel": "senior",
      "salaryRange": "$80,000 - $120,000",
      "minSalary": 80000,
      "maxSalary": 120000,
      "vacancies": 2,
      "status": "active",
      "Company": {
        "id": 1,
        "name": "TechCorp",
        "logo": "https://...",
        "website": "https://..."
      }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3,
  "message": "Jobs fetched successfully"
}
```

### Submit Application Request
```http
POST /api/applications/submit HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "jobId": 1,
  "coverLetter": "I am very interested in this senior role..."
}
```

### Submit Application Response
```json
{
  "success": true,
  "application": {
    "id": 123,
    "jobId": 1,
    "userId": 5,
    "status": "applied",
    "coverLetter": "I am very interested...",
    "createdAt": "2024-02-28T10:30:00.000Z",
    "updatedAt": "2024-02-28T10:30:00.000Z"
  },
  "message": "Application submitted successfully"
}
```
