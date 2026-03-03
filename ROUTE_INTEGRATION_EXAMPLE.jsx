/**
 * EXAMPLE: App.jsx Route Configuration for Job Portal
 * 
 * Add these routes to your main App.jsx to integrate the job portal pages
 * This is an example showing how to structure your routing
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protected/ProtectedRoute";

// Existing pages
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignIn from "./pages/SignIn";

// Job Portal - Job Seeker Pages
import { JobsListing, JobDetails, MyApplications } from "./pages/jobs";

// Job Portal - Company Pages
import { PostJob, CompanyJobs, JobApplications } from "./pages/company";

// Admin Pages (existing)
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />

        {/* ============ JOB PORTAL ROUTES ============ */}

        {/* PUBLIC JOB ROUTES - Anyone can access */}
        <Route path="/jobs" element={<JobsListing />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />

        {/* PROTECTED JOB SEEKER ROUTES */}
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="user">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED COMPANY ROUTES */}
        <Route
          path="/company/post-job"
          element={
            <ProtectedRoute role="company">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs"
          element={
            <ProtectedRoute role="company">
              <CompanyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/job/:jobId/applications"
          element={
            <ProtectedRoute role="company">
              <JobApplications />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

/**
 * NAVIGATION EXAMPLE
 * 
 * Update your navigation component to include:
 */

/*
function Navigation() {
  const user = useContext(AuthContext); // Your auth context

  return (
    <nav>
      <Link to="/">Home</Link>
      
      {user ? (
        <>
          {user.role === "user" && (
            <>
              <Link to="/jobs">Browse Jobs</Link>
              <Link to="/my-applications">My Applications</Link>
            </>
          )}
          
          {user.role === "company" && (
            <>
              <Link to="/company/jobs">My Jobs</Link>
              <Link to="/company/post-job">Post Job</Link>
            </>
          )}
          
          {user.role === "admin" && (
            <Link to="/admin">Admin Dashboard</Link>
          )}
          
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signin">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
*/

/**
 * SIGN UP FORM MODIFICATION
 * 
 * Update your signup form to include role selection:
 */

/*
function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "user" // NEW: role selection
  });

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  return (
    <form>
      {/* ... existing fields ... */}
      
      <div>
        <label>I am a:</label>
        <select value={formData.role} onChange={handleRoleChange}>
          <option value="user">Job Seeker</option>
          <option value="company">Employer</option>
        </select>
      </div>
      
      {/* ... submit button ... */}
    </form>
  );
}
*/

/**
 * PROTECTED ROUTE EXAMPLE
 * 
 * Update your ProtectedRoute component to support role checking:
 */

/*
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const user = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
*/

/**
 * CONTEXT EXAMPLE FOR MANAGING USER STATE
 * 
 * Create a context to manage user info including role:
 */

/*
import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await getMe();
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.log("Not authenticated");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
*/

/**
 * STYLING EXAMPLE
 * 
 * All components use Tailwind CSS. Example color scheme:
 */

/*
TAILWIND CLASSES USED:
- Buttons: bg-blue-600 text-white rounded hover:bg-blue-700
- Cards: border rounded-lg p-4 shadow
- Filters: bg-gray-100 px-4 py-2 border rounded-lg
- Status: bg-green-100 text-green-800 (active)
           bg-red-100 text-red-800 (rejected)
           bg-yellow-100 text-yellow-800 (pending)
*/

/**
 * API USAGE EXAMPLES
 * 
 * Here are common API calls used in the pages:
 */

/*
// Get all jobs
getAllJobs({ page: 1, limit: 10 });

// Search jobs with filters
searchJobs({
  query: "Engineer",
  location: "New York",
  jobType: "full-time"
});

// Get job details
getJobById(jobId);

// Apply for a job
submitApplication({
  jobId: 123,
  coverLetter: "I am interested..."
});

// Get user's applications
getApplicationsByUser(userId);

// Get applications for a job (company)
getApplicationsByJob(jobId);

// Update application status
updateApplicationStatus(applicationId, "accepted");

// Create company profile
createCompany({
  companyName: "Tech Corp",
  email: "company@techcorp.com",
  description: "Leading tech company",
  location: "San Francisco"
});

// Post a job
createJob({
  title: "Senior Engineer",
  description: "We are looking...",
  location: "Remote",
  jobType: "full-time",
  skillsRequired: ["JavaScript", "React"],
  experienceLevel: "senior",
  vacancies: 2
});
*/

/**
 * TESTING CHECKLIST
 */

/*
BEFORE GOING TO PRODUCTION:

□ All routes are accessible
□ Authentication is required for protected routes
□ Users can browse jobs without login
□ Job seekers can apply for jobs
□ Companies can post jobs
□ Admins have full access
□ Search and filters work correctly
□ Pagination works correctly
□ Status updates work correctly
□ Error messages are clear
□ Forms validate input correctly
□ Mobile responsive design works
□ No console errors
□ API calls return correct data
□ Role-based access is enforced
*/
