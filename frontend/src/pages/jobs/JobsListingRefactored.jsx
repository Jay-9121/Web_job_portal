import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Filter,
  X,
  Heart,
  ChevronDown,
  Loader,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllJobs,
  saveJob,
  removeSavedJob,
  getSavedJobs,
  getMe,
  getUserApplications,
  submitApplication,
} from "../../services/api";

export default function JobsListingRefactored() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch jobs and user data
  useEffect(() => {
    fetchData();
  }, [search, filters, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user info
      try {
        const userResponse = await getMe();
        if (userResponse.data.success) {
          setUser(userResponse.data.user);
        }
      } catch (err) {
        console.log("User not authenticated");
      }

      // Build query params
      const params = {
        page: currentPage,
        limit: 12,
        ...(search && { search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.jobType && { jobType: filters.jobType }),
        ...(filters.experience && { experience: filters.experience }),
      };

      const jobsResponse = await getAllJobs(params);
      if (jobsResponse.data.success) {
        setJobs(jobsResponse.data.jobs);
        setTotalPages(jobsResponse.data.totalPages);
      }

      // Fetch saved jobs if user is authenticated
      if (user) {
        try {
          const savedResponse = await getSavedJobs();
          if (savedResponse.data.success) {
            setSavedJobs(
              savedResponse.data.jobs.map((job) => job.id)
            );
          }
        } catch (err) {
          console.log("Could not fetch saved jobs");
        }
        // fetch user's applied jobs
        try {
          const appsResp = await getUserApplications();
          if (appsResp.data.success) {
            const ids = appsResp.data.applications.map((a) => a.jobId || a.job?.id || a.jobDetails?.id || a.Job?.id).filter(Boolean);
            setAppliedJobs(ids);
          }
        } catch (err) {
          console.log('Could not fetch user applications');
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load jobs");
      toast.error("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to save jobs");
      navigate("/login");
      return;
    }

    try {
      if (savedJobs.includes(jobId)) {
        await removeSavedJob(jobId);
        setSavedJobs(savedJobs.filter((id) => id !== jobId));
        toast.success("Job removed from saved");
      } else {
        await saveJob(jobId);
        setSavedJobs([...savedJobs, jobId]);
        toast.success("Job saved successfully!");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(
        error.response?.data?.message || "Failed to save job"
      );
    }
  };

  const handleResetFilters = () => {
    setFilters({ location: "", jobType: "", experience: "" });
    setSearch("");
    setCurrentPage(1);
  };

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const experiences = ["entry", "mid", "senior", "lead"];
  const locations = [
    "Remote",
    "San Francisco",
    "New York",
    "Austin",
    "London",
    "Sydney",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
              <p className="text-slate-600 mt-1">
                Discover {jobs.length > 0 ? totalPages * 12 : 0}+ exciting job
                opportunities
              </p>
            </div>
            <button
              onClick={() => navigate("/my-applications")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              My Applications
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by job title, company, or skills..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Filters</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Reset
                </button>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => {
                    setFilters({ ...filters, location: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => {
                    setFilters({ ...filters, jobType: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => {
                    setFilters({ ...filters, experience: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Levels</option>
                  {experiences.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp.charAt(0).toUpperCase() + exp.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900">Error loading jobs</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
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
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">
                  No jobs found
                </h3>
                <p className="text-slate-600 mb-4">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-indigo-600 font-semibold text-sm mt-1">
                          {job.Company?.name || "Company Name"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleSaveJob(job.id, e)}
                        className={`p-2 rounded-lg transition-all ${
                          savedJobs.includes(job.id)
                            ? "bg-rose-100 text-rose-600"
                            : "bg-slate-100 text-slate-400 hover:text-rose-600"
                        }`}
                        title={
                          savedJobs.includes(job.id)
                            ? "Remove from saved"
                            : "Save job"
                        }
                      >
                        <Heart
                          size={20}
                          fill={
                            savedJobs.includes(job.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                      {appliedJobs.includes(job.id) ? (
                        <button className="ml-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">Applied</button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            (async () => {
                              try {
                                await getMe();
                                const r = await submitApplication({ jobId: job.id });
                                if (r.data.success) {
                                  setAppliedJobs((prev) => [...new Set([...prev, job.id])]);
                                  toast.success('Application submitted');
                                }
                              } catch (err) {
                                console.error(err);
                                toast.error(err.response?.data?.message || 'Failed to apply');
                              }
                            })();
                          }}
                          className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                        >
                          Apply
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 mb-3 text-sm text-slate-600">
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

                    <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum =
                    currentPage > 3
                      ? currentPage - 2 + i
                      : i + 1;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
