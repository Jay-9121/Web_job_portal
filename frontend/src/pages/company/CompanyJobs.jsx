import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCompany, getMe } from "../../services/api";

export default function CompanyJobs() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAndFetchCompany();
  }, []);

  const checkAndFetchCompany = async () => {
    try {
      setLoading(true);

      // Check user
      const userResponse = await getMe();
      if (userResponse.data.success) {
        setUser(userResponse.data.user);
        if (userResponse.data.user.role !== "company") {
          alert("Only company representatives can access this page");
          navigate("/");
          return;
        }
      }

      // Fetch company data
      const companyResponse = await getMyCompany();
      if (companyResponse.data.success) {
        setCompany(companyResponse.data.company);
      }
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load company data. Please create a company profile first."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate("/company/profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Company Profile
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Posted Jobs</h1>
        <button
          onClick={() => navigate("/company/post-job")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Post New Job
        </button>
      </div>

      {/* Company Info */}
      {company && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{company.companyName}</h2>
          <p className="text-gray-700 mb-2">{company.description}</p>
          <p className="text-gray-600 text-sm">
            <strong>Location:</strong> {company.location}
          </p>
        </div>
      )}

      {/* Jobs List */}
      {company && company.Jobs && company.Jobs.length > 0 ? (
        <div className="space-y-4">
          {company.Jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 hover:shadow-lg transition bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {job.location}
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    <span className="bg-gray-200 px-2 py-1 rounded">
                      {job.jobType}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        job.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs">
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="px-3 py-2 border rounded hover:bg-gray-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/company/job/${job.id}/edit`)}
                    className="px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/company/job/${job.id}/applications`)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Applications
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No jobs posted yet.</p>
          <button
            onClick={() => navigate("/company/post-job")}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Post your first job
          </button>
        </div>
      )}
    </div>
  );
}
