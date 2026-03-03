import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Search,
  DollarSign,
  Clock,
  Users,
  ArrowRight,
  Filter,
  X,
  Heart,
  Menu,
  Sun,
  Moon,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import { getAllJobs, searchJobs, getMe, getUserApplications, submitApplication } from "../../services/api";
import {
  Button,
  Card,
  Input,
  Spinner,
} from "../../components/ui";

export default function JobsListing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    experience: "",
    minSalary: "",
    maxSalary: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 0,
    total: 0,
  });
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user data and applications
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const me = await getMe();
        if (me.data.success) {
          setUser(me.data.user);
          const appsRes = await getUserApplications();
          if (appsRes.data.success) {
            const ids = appsRes.data.applications.map((a) => a.jobId || a.job?.id || a.jobDetails?.id || a.Job?.id).filter(Boolean);
            setAppliedJobIds(ids);
          }
        }
      } catch (e) {
        console.log("User not logged in");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value)
        ),
      };

      const hasFilters = Object.values(filters).some(val => val);
      const response = hasFilters ? await searchJobs(params) : await getAllJobs(params);

      if (response.data.success) {
        setJobs(response.data.jobs);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.totalPages || Math.ceil(response.data.total / pagination.limit),
          total: response.data.total,
        }));
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      location: "",
      jobType: "",
      experience: "",
      minSalary: "",
      maxSalary: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleSaveJob = (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
      toast.info("Job removed from saved");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Job saved successfully!");
    }
  };

  const handleApply = async (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await submitApplication({ jobId });
      if (res.data.success) {
        setAppliedJobIds((prev) => [...new Set([...prev, jobId])]);
        toast.success('Application submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply for job');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      {/* ============== NAVBAR ============== */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              JOB<span className="text-indigo-600">HUNT</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Button onClick={() => navigate("/")} variant="secondary" size="sm">
              Back Home
            </Button>
            {user ? (
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user.name}
              </div>
            ) : (
              <Button onClick={() => navigate("/login")} size="sm">
                Sign In
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 text-slate-600">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="text-slate-600 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t bg-slate-50 dark:bg-slate-700 p-4 space-y-3">
            <Button onClick={() => navigate("/")} variant="secondary" className="w-full">
              Back Home
            </Button>
            {user ? (
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 p-2">
                {user.name}
              </div>
            ) : (
              <Button onClick={() => navigate("/login")} className="w-full">
                Sign In
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* ============== MAIN CONTENT ============== */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">
              Explore Job Opportunities
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Find your perfect role with advanced filters and search
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                type="text"
                name="search"
                placeholder="Search by job title, skills, or company..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside className={`lg:w-80 ${showFilters ? "block" : "hidden"} lg:block`}>
              <Card padding="lg" className="sticky top-28 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-slate-600 hover:text-slate-900"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., San Francisco, Remote"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-800 dark:text-white focus:border-indigo-500"
                  />
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-800 dark:text-white focus:border-indigo-500"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-800 dark:text-white focus:border-indigo-500"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div className="mb-8 space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Salary Range
                  </label>
                  <input
                    type="number"
                    name="minSalary"
                    placeholder="Min Salary"
                    value={filters.minSalary}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-800 dark:text-white focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    name="maxSalary"
                    placeholder="Max Salary"
                    value={filters.maxSalary}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-800 dark:text-white focus:border-indigo-500"
                  />
                </div>

                <Button onClick={handleClearFilters} variant="secondary" className="w-full">
                  Clear All Filters
                </Button>
              </Card>
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {pagination.total} Jobs Found
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {filters.search ? `Showing results for "${filters.search}"` : "All available positions"}
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>

              {/* Error State */}
              {error && (
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 mb-6">
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </Card>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : jobs.length === 0 ? (
                <Card className="text-center py-16 dark:bg-slate-800">
                  <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    No jobs found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={handleClearFilters} variant="secondary">
                    Clear Filters
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      saved={savedJobs.includes(job.id)}
                      applied={appliedJobIds.includes(job.id)}
                      onSave={(e) => handleSaveJob(job.id, e)}
                      onApply={(e) => handleApply(job.id, e)}
                      onViewDetails={() => handleViewDetails(job.id)}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                    }
                    disabled={pagination.page === 1}
                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(pagination.totalPages, prev.page + 1),
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============== JOB CARD COMPONENT ============== */
const JobCard = ({ job, saved, applied, onSave, onApply, onViewDetails, index }) => {
  const companyName = job.Company?.name || job.companyName || job.company || "Company";
  const logoLetter = companyName.charAt(0).toUpperCase();
  const skills = job.skillsRequired || job.skills || [];

  return (
    <Card
      padding="lg"
      className="group bg-white dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-5">
        {/* Company Logo */}
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-indigo-500/20">
          {logoLetter}
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{companyName}</p>
            </div>
            <button
              onClick={onSave}
              className={`p-2 rounded-lg transition-all ${saved ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20" : "text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"}`}
            >
              <Heart size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              {job.location || "Remote"}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign size={16} />
              {job.salaryRange || "Competitive"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 line-clamp-2">
            {job.description}
          </p>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold">
                  +{skills.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Job Metadata */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              💼 {job.jobType || "Full-time"}
            </span>
            {job.experienceLevel && (
              <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                ⭐ {job.experienceLevel}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button onClick={onViewDetails} size="sm" className="whitespace-nowrap">
            View Details <ArrowRight size={14} className="ml-1" />
          </Button>
          {applied ? (
            <Button variant="ghost" size="sm" disabled className="text-slate-500">
              ✓ Applied
            </Button>
          ) : (
            <Button onClick={onApply} variant="secondary" size="sm" className="whitespace-nowrap">
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );};