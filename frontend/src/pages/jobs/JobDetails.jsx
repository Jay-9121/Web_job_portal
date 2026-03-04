import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, submitApplication, getMe } from "../../services/api";
import ApplicationModal from "./ApplicationModal";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [applied, setApplied] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchUserInfo();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await getJobById(jobId);
      if (response.data.success) {
        setJob(response.data.job);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getMe();
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.log("User not authenticated");
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      alert("Please log in to apply for jobs");
      navigate("/login");
      return;
    }

    if (user.role !== "user") {
      alert("Only job seekers can apply for jobs");
      return;
    }

    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (fullCoverLetter, skills, experience, cvFile) => {
    try {
      setApplying(true);
      
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('jobId', parseInt(jobId));
      formData.append('coverLetter', fullCoverLetter || '');
      formData.append('skills', JSON.stringify(skills || []));
      formData.append('experience', JSON.stringify(experience || []));
      
      // Append CV file if selected
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const response = await submitApplication(formData);

      if (response.data.success) {
        setApplied(true);
        setShowApplicationModal(false);
        setSuccessMessage("✓ Application submitted successfully! Check your email for updates.");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        alert(response.data.message || "Failed to submit application");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      <div className="h-12 bg-gray-300 rounded w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-300 rounded"></div>
        ))}
      </div>
      <div className="h-32 bg-gray-300 rounded mb-4"></div>
      <div className="h-20 bg-gray-300 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {renderLoadingSkeleton()}
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/jobs")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Back to Jobs
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-semibold mb-2">Error</p>
          <p>{error || "Job not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/jobs")}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
      >
        ← Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-4 mb-6">
              {job.Company?.logo ? (
                <img
                  src={job.Company.logo}
                  alt={job.Company?.name}
                  className="w-24 h-24 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl">
                  🏢
                </div>
              )}
              <div className="flex-grow">
                <h1 className="text-4xl font-bold text-gray-800 mb-1">{job.title}</h1>
                <p className="text-xl text-blue-600 font-semibold mb-2">
                  {job.Company?.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {job.status === "active" ? "✓ Accepting Applications" : "Closed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Job Type</p>
                <p className="text-lg font-bold text-gray-800 capitalize">{job.jobType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Location</p>
                <p className="text-lg font-bold text-gray-800">{job.location || "Remote"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Experience</p>
                <p className="text-lg font-bold text-gray-800 capitalize">
                  {job.experienceLevel || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Salary</p>
                <p className="text-lg font-bold text-green-600">
                  {job.salaryRange || "Competitive"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Vacancies</p>
                <p className="text-lg font-bold text-gray-800">{job.vacancies}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Posted</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Job Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>

          {/* Skills Required - Moved up for better visibility */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-medium border border-blue-200"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          {job.Company && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">About the Company</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {job.Company.description || "No description available"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Company Location</p>
                  <p className="text-gray-800">{job.Company.location || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Website</p>
                  {job.Company.website ? (
                    <a
                      href={job.Company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium break-all"
                    >
                      {job.Company.website}
                    </a>
                  ) : (
                    <p className="text-gray-800">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Application Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            {job.status === "active" ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Apply Now</h2>
                
                {successMessage && (
                  <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {successMessage}
                  </div>
                )}

                {applied ? (
                  <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">✓ Application Submitted!</p>
                    <p className="text-sm mt-2">
                      Check your email for updates on your application.
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApplyClick}
                      disabled={applying}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors mb-4"
                    >
                      {applying ? "Submitting..." : "Apply with Your Profile"}
                    </button>
                    {!user && (
                      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                        <p className="font-semibold mb-2">Log in to Apply</p>
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Sign in to your account
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="bg-gray-100 border-2 border-gray-400 text-gray-700 px-4 py-3 rounded-lg">
                <p className="font-semibold mb-2">Position Closed</p>
                <p className="text-sm">
                  This job is no longer accepting applications.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
          <ApplicationModal 
            job={job}
            onClose={() => setShowApplicationModal(false)}
            onSubmit={handleApplicationSubmit}
            isSubmitting={applying}
          />
        )}
      </div>
    </div>
  );
}
