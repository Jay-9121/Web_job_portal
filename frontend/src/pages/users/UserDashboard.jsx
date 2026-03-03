import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Plus,
  Clock,
  ChevronRight,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Heart,
  CheckCircle,
  XCircle,
  Eye,
  Building2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  getAllJobs,
  submitApplication,
  getUserApplications,
  getMe,
} from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import {
  Card,
  Badge,
  Button,
  Spinner,
  EmptyState,
  ProgressBar,
  Tabs,
} from "../../components/ui";
import JobsDisplay from "../jobs/JobsDisplay";

const UserDashboard = ({
  user = { username: "Guest", role: "Job Seeker" },
  onLogout,
  setCurrentPage,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("Jobs");
  const [stats, setStats] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const displayUser = {
    username: user?.username || "Guest",
    role: user?.role || "Job Seeker",
  };

  // tab: the tab id/name, propagate: when true also notify parent to change currentPage
  const handleTabChange = (tab, propagate = false) => {
    setActiveTab(tab);
    if (propagate && setCurrentPage) setCurrentPage(tab.toLowerCase());
  };

  // Fetch real user applications and build stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingStats(true);
        setLoadingApps(true);

        // fetch current user (to ensure auth) and their applications
        console.log("[UserDashboard] Fetching user info via getMe()...");
        await getMe();
        console.log("[UserDashboard] getMe() succeeded, now fetching applications...");
        
        const appsRes = await getUserApplications();
        console.log("[UserDashboard] getUserApplications() succeeded:", appsRes.data);
        
        const apps = appsRes.data.applications || appsRes.data.applications || [];
        setApplications(apps);

        // compute simple stats from applications
        const total = apps.length;
        const accepted = apps.filter((a) => a.status === "accepted").length;
        const rejected = apps.filter((a) => a.status === "rejected").length;
        const pending = apps.filter((a) => a.status === "applied" || a.status === "shortlisted").length;

        setStats([
          {
            label: "Applications",
            value: String(total || 0),
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: null,
          },
          {
            label: "Accepted",
            value: String(accepted || 0),
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Pending",
            value: String(pending || 0),
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "Rejected",
            value: String(rejected || 0),
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ]);
      } catch (err) {
        console.error("[UserDashboard] Failed to load applications/stats:", {
          status: err.response?.status,
          message: err.response?.data?.message || err.message,
          url: err.config?.url,
          fullError: err,
        });
        // Set empty stats as fallback
        setStats([
          { label: "Applications", value: "0", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Accepted", value: "0", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending", value: "0", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Rejected", value: "0", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
        ]);
        setApplications([]);
      } finally {
        setLoadingStats(false);
        setLoadingApps(false);
      }
    };

    loadData();
  }, []);

  // Fetch recent jobs for quick apply
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await getAllJobs({ limit: 6 });
        setJobs(res.data.jobs || res.data || []);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    loadJobs();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { variant: "warning", label: "Pending" },
      shortlisted: { variant: "warning", label: "Shortlisted" },
      accepted: { variant: "success", label: "Accepted" },
      rejected: { variant: "danger", label: "Rejected" },
    };
    const config = statusConfig[status] || statusConfig.applied;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleApply = async (jobId) => {
    try {
      const res = await submitApplication({ jobId });
      if (res.data.success) {
        // refresh applications and stats
        const appsRes = await getUserApplications();
        const apps = appsRes.data.applications || [];
        setApplications(apps);

        const total = apps.length;
        const accepted = apps.filter((a) => a.status === "accepted").length;
        const rejected = apps.filter((a) => a.status === "rejected").length;
        const pending = apps.filter((a) => a.status === "applied" || a.status === "shortlisted").length;

        setStats((s) => [
          { ...s[0], value: String(total) },
          { ...s[1], value: String(accepted) },
          { ...s[2], value: String(pending) },
          { ...s[3], value: String(rejected) },
        ]);
      }
    } catch (err) {
      console.error("Failed to apply", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to apply for job");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Modern White Header */}
      <header
        className={`fixed top-0 right-0 left-0 h-20 backdrop-blur-md border-b z-40 flex items-center justify-between px-8 md:left-64 ${
          theme === "dark"
            ? "bg-slate-900/80 border-slate-700"
            : "bg-white/80 border-gray-100"
        }`}
      >
        <div>
          <h2
            className={`text-xl font-black tracking-tight uppercase italic ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {activeTab} <span className="text-indigo-500">Overview</span>
          </h2>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none w-60 text-sm transition-all"
            />
          </div>

          <button
            className={`p-2 rounded-xl transition-colors relative ${
              theme === "dark"
                ? "text-gray-400 hover:bg-slate-800"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div
            className={`flex items-center gap-3 pl-5 border-l ${
              theme === "dark" ? "border-slate-700" : "border-gray-100"
            }`}
          >
            <div className="text-right">
              <p
                className={`text-sm font-bold leading-none mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {displayUser.username}
              </p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                {displayUser.role}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black">
              {displayUser.username[0]}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8 pt-28">
        {/* tab navigation inside dashboard */}
        <div className="mb-6">
          <Tabs
            tabs={[
              { id: "Jobs", label: "Jobs" },
              { id: "Applications", label: "Applications" },
            ]}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>

        <div className="space-y-8">
          {/* Render JobsDisplay if Jobs tab is active */}
          {activeTab === "Jobs" ? (
            <div className="h-full -mx-8 -mb-8">
              <JobsDisplay onNavigate={handleTabChange} />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingStats
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-white animate-pulse rounded-3xl border border-gray-100"
                />
              ))
            : stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} p-4 rounded-2xl`}>
                      <stat.icon className={`${stat.color}`} size={24} />
                    </div>
                    {stat.trend && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-black ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications Table */}
          <div
            className={`lg:col-span-2 rounded-[2.5rem] border shadow-sm overflow-hidden ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3
                className={`text-lg font-black uppercase italic tracking-tight ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                My Applications
              </h3>
              <div className="flex items-center gap-4">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
                <button
                  onClick={() => handleTabChange("Applications")}
                  className="text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All <ChevronRight size={14} />
                </button>
              </div> REPLACE
              </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={
                    theme === "dark" ? "bg-slate-700/50" : "bg-gray-50/50"
                  }
                >
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <th className="px-8 py-4 text-left">Job</th>
                    <th className="px-8 py-4 text-left">Company</th>
                    <th className="px-8 py-4 text-left">Status</th>
                    <th className="px-8 py-4 text-right">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingApps ? (
                    <tr>
                      <td colSpan="4" className="p-20 text-center">
                        <Spinner size="lg" />
                      </td>
                    </tr>
                  ) : applications.length > 0 ? (
                    applications.map((app) => {
                      // Get the correct job and company data from API response
                      const jobTitle = app.Job?.title || app.jobTitle || "Unknown Job";
                      const companyName = app.Job?.Company?.name || app.company || "Unknown Company";
                      const location = app.Job?.location || app.location || "Not specified";
                      const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : app.appliedDate || "N/A";
                      
                      return (
                        <tr
                          key={app.id}
                          className={`group hover:bg-indigo-50/30 transition-colors ${
                            theme === "dark" ? "hover:bg-slate-700/50" : ""
                          }`}
                        >
                          <td className="px-8 py-6">
                            <div
                              className={`font-bold ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              } group-hover:text-indigo-600 transition-colors`}
                            >
                              {jobTitle}
                            </div>
                            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                              {location}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                {companyName.charAt(0).toUpperCase()}
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {companyName}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {getStatusBadge(app.status)}
                          </td>
                          <td
                            className={`px-8 py-6 text-right font-bold ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {appliedDate}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-20 text-center text-gray-400 font-bold italic"
                      >
                        No applications yet. Start applying!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card
              className={
                theme === "dark" ? "bg-slate-800 border-slate-700" : ""
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <TrendingUp className="text-indigo-600" size={20} />
                </div>
                <h4
                  className={`font-black uppercase ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Profile Strength
                </h4>
              </div>
              <ProgressBar
                value={75}
                showLabel
                variant="primary"
                className="mb-3"
              />
              <p className="text-sm text-gray-500">
                Complete your profile to get more interviews!
              </p>
            </Card>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 italic uppercase tracking-tighter">
                  Find Your Dream Job
                </h3>
                <p className="text-indigo-100 text-xs font-medium mb-8 leading-relaxed">
                  Browse thousands of job openings from top companies.
                </p>
                <button
                  onClick={() => handleTabChange("Jobs", true)}
                  className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-50 transition-all active:scale-95"
                >
                  <Plus size={18} className="inline mr-2" strokeWidth={3} />
                  Browse Jobs
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            {/* Jobs (quick apply) */}
            <Card
              className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className={`font-black uppercase ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Latest Jobs
                </h4>
                <button onClick={() => handleTabChange("Jobs", true)} className="text-xs font-bold text-indigo-600">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {loadingJobs ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl animate-pulse h-12" />
                    ))}
                  </div>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div key={job.id} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{job.title || job.jobTitle || job.name}</h5>
                        <p className="text-xs text-gray-500">{job.Company?.companyName || job.companyName || job.company || ""}</p>
                      </div>
                      <div>
                        <Button size="sm" variant="primary" onClick={() => handleApply(job.id)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No jobs found</div>
                )}
              </div>
            </Card>
          </div>
        </div>
        </>
        )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
