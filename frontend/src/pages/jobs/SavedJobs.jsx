import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  DollarSign,
  Briefcase,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getSavedJobs,
  removeSavedJob,
  submitApplication,
} from "../../services/api";

export default function SavedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [showCoverLetter, setShowCoverLetter] = useState(null);
  const [coverLetters, setCoverLetters] = useState({});

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSavedJobs();
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to load saved jobs";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      await removeSavedJob(jobId);
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job removed from saved");
    } catch (err) {
      console.error("Error removing saved job:", err);
      toast.error(
        err.response?.data?.message || "Failed to remove job"
      );
    }
  };

  const handleApply = async (jobId) => {
    try {
      setSubmittingId(jobId);
      const response = await submitApplication({
        jobId,
        coverLetter: coverLetters[jobId] || null,
      });

      if (response.data.success) {
        toast.success("Application submitted successfully!");
        setShowCoverLetter(null);
        setCoverLetters({ ...coverLetters, [jobId]: "" });
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Saved Jobs</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-300 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-slate-300 rounded w-1/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-300 rounded w-20"></div>
                  <div className="h-8 bg-slate-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Saved Jobs</h1>
          <button
            onClick={() => navigate("/jobs")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Browse More Jobs
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
            <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-slate-600 mb-6">
              Save jobs you're interested in to apply later
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-block"
            >
              Explore Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {job.title}
                    </h3>
                    <p className="text-indigo-600 font-semibold text-sm mt-1">
                      {job.Company?.name || "Company Name"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveSavedJob(job.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600">
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                  )}
                  {job.jobType && (
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      {job.jobType}
                    </div>
                  )}
                  {job.salaryRange && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      {job.salaryRange}
                    </div>
                  )}
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {job.description}
                </p>

                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        +{job.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setShowCoverLetter(showCoverLetter === job.id ? null : job.id)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    {showCoverLetter === job.id ? "Close" : "Apply Now"}
                  </button>
                </div>

                {showCoverLetter === job.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetters[job.id] || ""}
                      onChange={(e) =>
                        setCoverLetters({
                          ...coverLetters,
                          [job.id]: e.target.value,
                        })
                      }
                      placeholder="Tell the employer why you're a great fit for this role..."
                      rows="4"
                      maxLength="2000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-slate-500">
                        {(coverLetters[job.id] || "").length}/2000 characters
                      </p>
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={submittingId === job.id}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                      >
                        {submittingId === job.id ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
