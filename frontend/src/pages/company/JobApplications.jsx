import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getApplicationsByJob, updateApplicationStatus, getMe } from "../../services/api";

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    checkAuthAndFetchApplications();
  }, [jobId]);

  const checkAuthAndFetchApplications = async () => {
    try {
      setLoading(true);

      // Check user
      const userResponse = await getMe();
      if (userResponse.data.success) {
        setUser(userResponse.data.user);
      }

      // Fetch applications
      const response = await getApplicationsByJob(jobId);
      if (response.data.success) {
        setApplications(response.data.applications);
      }
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const response = await updateApplicationStatus(applicationId, newStatus);

      if (response.data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      shortlisted: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Applications</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No applications found.</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="border rounded-lg p-4 bg-white hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">
                    {application.applicant?.username}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {application.applicant?.email}
                  </p>
                  {application.applicant?.phoneNumber && (
                    <p className="text-gray-600 text-sm">
                      Phone: {application.applicant.phoneNumber}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">
                    Location: {application.applicant?.location || "Not provided"}
                  </p>
                </div>

                <div className={`px-3 py-1 rounded ${getStatusColor(application.status)}`}>
                  {application.status}
                </div>
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <details className="mb-3">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                    View Cover Letter
                  </summary>
                  <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded">
                    {application.coverLetter}
                  </p>
                </details>
              )}

              {/* Skills & Qualifications */}
              {application.skills && application.skills.length > 0 && (
                <details className="mb-3">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                    Skills & Qualifications ({application.skills.length})
                  </summary>
                  <ul className="mt-2 space-y-1 bg-gray-50 p-3 rounded">
                    {application.skills.map((skill, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">
                        ✓ {skill}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {/* Work Experience */}
              {application.experience && application.experience.length > 0 && (
                <details className="mb-3">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                    Work Experience ({application.experience.length})
                  </summary>
                  <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded">
                    {application.experience.map((exp, idx) => (
                      <div key={idx} className="text-gray-700 text-sm border-l-2 border-blue-400 pl-3">
                        <p className="font-semibold">{exp.position}</p>
                        <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Application Date */}
              <p className="text-gray-600 text-xs mb-3">
                Applied: {new Date(application.createdAt).toLocaleDateString()}
              </p>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(application.id, "shortlisted")}
                  disabled={updatingId === application.id}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleUpdateStatus(application.id, "accepted")}
                  disabled={updatingId === application.id}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus(application.id, "rejected")}
                  disabled={updatingId === application.id}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {applications.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Application Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-xl font-bold">{applications.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Applied</p>
              <p className="text-xl font-bold">
                {applications.filter((a) => a.status === "applied").length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Shortlisted</p>
              <p className="text-xl font-bold">
                {applications.filter((a) => a.status === "shortlisted").length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Accepted</p>
              <p className="text-xl font-bold">
                {applications.filter((a) => a.status === "accepted").length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Rejected</p>
              <p className="text-xl font-bold">
                {applications.filter((a) => a.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
