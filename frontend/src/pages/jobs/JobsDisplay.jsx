import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ChevronRight,
  Filter,
  X,
  Loader,
  Heart,
  Share2,
  ChevronLeft,
} from "lucide-react";
import {
  getAllJobs,
  submitApplication,
  getJobById,
} from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import {
  Card,
  Badge,
  Button,
  Spinner,
  EmptyState,
} from "../../components/ui";
import ApplicationModal from "./ApplicationModal";

const JobsDisplay = ({ onNavigate = null }) => {
  const { theme } = useTheme();

  // State management
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experienceLevel: "",
    minSalary: "",
    maxSalary: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllJobs({
        ...filters,
        search: searchTerm,
        ...params,
      });
      const jobsData = response.data.jobs || response.data || [];
      setJobs(jobsData);

      // Reset to first page when filters change
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      fetchJobs();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Apply usable filter function
  useEffect(() => {
    let filtered = jobs;

    // Additional client-side filtering if needed
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, searchTerm]);

  // Fetch job details when a job is selected
  const handleSelectJob = async (job) => {
    // guard against invalid job object
    const id = parseInt(job?.id, 10);
    if (!id || isNaN(id)) {
      console.warn("handleSelectJob called with invalid id", job);
      return;
    }

    if (selectedJob?.id === id) {
      setSelectedJob(null);
      return;
    }

    try {
      setLoadingJobDetails(true);
      const response = await getJobById(id);
      // backend wraps result in `job` property
      setSelectedJob(response.data.job || response.data);
    } catch (error) {
      console.error("Failed to fetch job details:", error, error.response?.data);
      // fall back to the passed-in job object
      setSelectedJob(job);
    } finally {
      setLoadingJobDetails(false);
    }
  };

  // Handle job application - open modal
  const handleApplyJob = async (jobId) => {
    const id = parseInt(jobId, 10);
    if (!id || isNaN(id)) {
      console.warn("handleApplyJob got invalid id", jobId);
      return;
    }

    try {
      setLoadingJobDetails(true);
      const response = await getJobById(id);
      setJobToApply(response.data.job || response.data);
      setShowApplicationModal(true);
    } catch (error) {
      console.error("Failed to fetch job details:", error, error.response?.data);
      alert("Failed to load job details");
    } finally {
      setLoadingJobDetails(false);
    }
  };

  // Handle application modal submission
  const handleApplicationSubmit = async (coverLetter, skills = [], experience = [], cvFile = null) => {
    if (!jobToApply) return;

    try {
      setApplying(true);
      
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('jobId', jobToApply.id);
      formData.append('coverLetter', coverLetter || '');
      formData.append('skills', JSON.stringify(skills || []));
      formData.append('experience', JSON.stringify(experience || []));
      
      // Append CV file if selected
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const response = await submitApplication(formData);
      if (response.data.success) {
        alert("Application submitted successfully!");
        setShowApplicationModal(false);
        setJobToApply(null);
        // Mark job as applied
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobToApply.id ? { ...job, applied: true } : job
          )
        );
        // if parent passed a navigation callback, jump to applications tab
        if (onNavigate) {
          onNavigate("applications");
        }
      } else {
        // show server-side message when present
        alert(response.data.message || "Failed to apply for job");
      }
    } catch (error) {
      console.error("Failed to apply:", error);
      alert(error.response?.data?.message || "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      location: "",
      jobType: "",
      experienceLevel: "",
      minSalary: "",
      maxSalary: "",
    });
    setSearchTerm("");
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    return `$${salary.toLocaleString()}`;
  };

  const jobTypeColors = {
    "full-time": "bg-blue-100 text-blue-800",
    "part-time": "bg-green-100 text-green-800",
    contract: "bg-purple-100 text-purple-800",
    internship: "bg-orange-100 text-orange-800",
    freelance: "bg-pink-100 text-pink-800",
  };

  const experienceLevelColors = {
    entry: "bg-emerald-100 text-emerald-800",
    mid: "bg-yellow-100 text-yellow-800",
    senior: "bg-red-100 text-red-800",
    director: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className={`flex h-full ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Left Sidebar - Filters */}
      <div
        className={`w-full md:w-80 border-r p-6 space-y-6 overflow-y-auto ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        } ${showFilters ? "block" : "hidden md:block"}`}
      >
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              theme === "dark"
                ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h3
            className={`font-bold text-lg uppercase ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Filters
          </h3>
          {(searchTerm || Object.values(filters).some((v) => v)) && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <X size={14} />
              Reset
            </button>
          )}
        </div>

        {/* Location Filter */}
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Location
          </label>
          <input
            type="text"
            placeholder="e.g., New York"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === "dark"
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          />
        </div>

        {/* Job Type Filter */}
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange("jobType", e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === "dark"
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        {/* Experience Level Filter */}
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Experience Level
          </label>
          <select
            value={filters.experienceLevel}
            onChange={(e) =>
              handleFilterChange("experienceLevel", e.target.value)
            }
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === "dark"
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="director">Director</option>
          </select>
        </div>

        {/* Salary Range Filter */}
        <div className="space-y-3">
          <label
            className={`block text-xs font-bold uppercase ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Salary Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minSalary}
              onChange={(e) => handleFilterChange("minSalary", e.target.value)}
              className={`w-1/2 px-3 py-2 rounded-lg border text-sm ${
                theme === "dark"
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSalary}
              onChange={(e) => handleFilterChange("maxSalary", e.target.value)}
              className={`w-1/2 px-3 py-2 rounded-lg border text-sm ${
                theme === "dark"
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Filter Toggle */}
        <div
          className={`border-b px-6 py-4 flex items-center justify-between md:hidden ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Jobs
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Jobs List and Details */}
        <div className="flex-1 overflow-y-auto flex gap-6 p-6">
          {/* Jobs List */}
          <div className={`flex-1 space-y-4 ${selectedJob ? "hidden md:flex md:flex-col" : ""}`}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
              </div>
            ) : paginatedJobs.length > 0 ? (
              <>
                {paginatedJobs.map((job, idx) => (
                  <div
                    key={job.id || `job-${idx}`}
                    onClick={() => handleSelectJob(job)}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      selectedJob?.id === job.id
                        ? theme === "dark"
                          ? "bg-indigo-900/30 border-indigo-500"
                          : "bg-indigo-50 border-indigo-300"
                        : theme === "dark"
                        ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-bold mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {job.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {job.companyDetails?.name || "Company Name"}
                        </p>
                      </div>
                      <Badge
                        className={jobTypeColors[job.jobType] || "bg-gray-100"}
                      >
                        {job.jobType}
                      </Badge>
                    </div>

                    {/* Job Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <DollarSign size={16} />
                        {job.salaryRange || `${formatSalary(job.minSalary)} - ${formatSalary(job.maxSalary)}`}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={16} />
                        {job.experienceLevel}
                      </div>
                    </div>

                    {/* Description Preview */}
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {job.description}
                    </p>

                    {/* Quick Apply Button */}
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyJob(job.id);
                        }}
                        disabled={applying || !job.id}
                      >
                        {applying ? (
                          <>
                            <Loader size={14} className="animate-spin mr-1" />
                            Applying...
                          </>
                        ) : job.applied ? (
                          "Already Applied"
                        ) : (
                          "Apply Now"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectJob(job);
                        }}
                        disabled={!job.id}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg enabled:hover:bg-indigo-100 disabled:text-gray-300"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : theme === "dark"
                                ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg enabled:hover:bg-indigo-100 disabled:text-gray-300"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No Jobs Found"
                description="Try adjusting your filters or search terms"
              />
            )}
          </div>

          {/* Job Details Panel */}
          {selectedJob && (
            <div
              className={`hidden md:flex md:w-1/3 flex-col border rounded-xl p-6 ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {loadingJobDetails ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner size="lg" />
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge
                          className={
                            jobTypeColors[selectedJob.jobType] || "bg-gray-100"
                          }
                        >
                          {selectedJob.jobType}
                        </Badge>
                      </div>
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <h2
                      className={`text-2xl font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedJob.title}
                    </h2>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedJob.companyDetails?.name || "Company Name"}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-indigo-600" />
                      <span
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {selectedJob.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign size={18} className="text-indigo-600" />
                      <span
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {selectedJob.salaryRange ||
                          `${formatSalary(
                            selectedJob.minSalary
                          )} - ${formatSalary(selectedJob.maxSalary)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase size={18} className="text-indigo-600" />
                      <span
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {selectedJob.experienceLevel
                          ?.charAt(0)
                          .toUpperCase() + selectedJob.experienceLevel?.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Skills Required */}
                  {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <h3
                        className={`font-bold mb-3 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Skills Required
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Apply Button - Moved up for better visibility */}
                  <div className="mb-4 pb-4 border-b border-gray-200 space-y-3">
                    <Button
                      fullWidth
                      variant="primary"
                      onClick={() => handleApplyJob(selectedJob.id)}
                      disabled={applying || !selectedJob?.id}
                    >
                      {applying ? (
                        <>
                          <Loader size={16} className="animate-spin mr-2" />
                          Applying...
                        </>
                      ) : selectedJob.applied ? (
                        "Already Applied"
                      ) : (
                        "Apply Now"
                      )}
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        fullWidth
                        variant="secondary"
                        className="flex items-center justify-center gap-2"
                      >
                        <Heart size={16} />
                        Save
                      </Button>
                      <Button
                        fullWidth
                        variant="secondary"
                        className="flex items-center justify-center gap-2"
                      >
                        <Share2 size={16} />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3
                      className={`font-bold mb-3 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      About the Job
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {selectedJob.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && jobToApply && (
        <ApplicationModal
          job={jobToApply}
          onClose={() => {
            setShowApplicationModal(false);
            setJobToApply(null);
          }}
          onSubmit={handleApplicationSubmit}
          isSubmitting={applying}
        />
      )}
    </div>
  );
};

export default JobsDisplay;
