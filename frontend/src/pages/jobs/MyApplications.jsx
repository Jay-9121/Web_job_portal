import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserApplications, getMe } from "../../services/api";

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchUserAndApplications();
  }, []);

  const fetchUserAndApplications = async () => {
    try {
      setLoading(true);
      // Get user info
      const userResponse = await getMe();
      if (userResponse.data.success) {
        setUser(userResponse.data.user);

        // Get user applications via stats endpoint
        const appResponse = await getUserApplications();
        if (appResponse.data.success) {
          setApplications(appResponse.data.applications);
        }
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSortedApplications = (apps) => {
    let sorted = [...apps];
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "title":
        return sorted.sort((a, b) => 
          (a.Job?.title || "").localeCompare(b.Job?.title || "")
        );
      default:
        return sorted;
    }
  };

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const sortedApplications = getSortedApplications(filteredApplications);

  const getStatusConfig = (status) => {
    const configs = {
      applied: { icon: "📝", color: "bg-blue-100 text-blue-800", label: "Applied" },
      shortlisted: { icon: "⭐", color: "bg-yellow-100 text-yellow-800", label: "Shortlisted" },
      accepted: { icon: "✓", color: "bg-green-100 text-green-800", label: "Accepted" },
      rejected: { icon: "✗", color: "bg-red-100 text-red-800", label: "Rejected" },
      withdrawn: { icon: "↩", color: "bg-gray-100 text-gray-800", label: "Withdrawn" },
    };
    return configs[status] || { icon: "❓", color: "bg-gray-100 text-gray-800", label: status };
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-300 rounded w-20"></div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>
        {renderLoadingSkeleton()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Job Applications</h1>
        <button
          onClick={() => navigate("/jobs")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Browse Jobs
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
          <p className="font-semibold mb-1">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status ({applications.length})</option>
              <option value="applied">
                Applied ({applications.filter(a => a.status === "applied").length})
              </option>
              <option value="shortlisted">
                Shortlisted ({applications.filter(a => a.status === "shortlisted").length})
              </option>
              <option value="accepted">
                Accepted ({applications.filter(a => a.status === "accepted").length})
              </option>
              <option value="rejected">
                Rejected ({applications.filter(a => a.status === "rejected").length})
              </option>
              <option value="withdrawn">
                Withdrawn ({applications.filter(a => a.status === "withdrawn").length})
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Job Title (A-Z)</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{sortedApplications.length}</span> of{" "}
              <span className="font-semibold">{applications.length}</span> applications
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {sortedApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-lg font-semibold text-gray-700 mb-2">No applications found</p>
          <p className="text-gray-600 mb-4">
            {filterStatus !== "all"
              ? "No applications with this status yet."
              : "You haven't applied to any jobs yet."}
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            Start browsing jobs →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedApplications.map((application) => {
            const statusConfig = getStatusConfig(application.status);
            return (
              <div
                key={application.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {application.Job?.title}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm">
                      {application.Job?.Company?.name}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                </div>

                {/* Job Details Row */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3 pb-3 border-b">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">💼</span>
                    <span>{application.Job?.jobType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">📍</span>
                    <span>{application.Job?.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">💰</span>
                    <span>{application.Job?.salaryRange || "Competitive"}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-3 text-xs text-gray-500">
                  <p>
                    Applied on <span className="font-semibold">{new Date(application.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                  {application.updatedAt !== application.createdAt && (
                    <p>
                      Last updated <span className="font-semibold">{new Date(application.updatedAt).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>

                {/* Cover Letter Section */}
                {application.coverLetter && (
                  <details className="mb-3 group">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-sm group-open:mb-3">
                      📄 View Your Cover Letter
                    </summary>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {application.coverLetter}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => navigate(`/jobs/${application.jobId}`)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                  >
                    View Job Details
                  </button>
                  {application.Job?.Company && (
                    <button
                      onClick={() => window.open(`/company/${application.Job.Company.id}`, '_blank')}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                      Company Profile
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
