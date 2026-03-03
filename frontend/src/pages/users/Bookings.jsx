import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Briefcase,
  DollarSign,
  Building2,
  Send,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { getUserApplications } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import { Card, Badge, Button } from "../../components/ui";

const Bookings = ({ user, onLogout, setCurrentPage }) => {
  const { theme } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState(null);

  // Fetch real applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getUserApplications();
        
        if (response.data.success) {
          // Transform backend data to match UI structure
          const transformedApps = response.data.applications.map((app) => ({
            id: app.id,
            jobTitle: app.jobDetails?.title || app.Job?.title || "Unknown Job",
            company: app.jobDetails?.companyDetails?.name || app.Job?.Company?.companyName || app.Job?.Company?.name || "Unknown Company",
            location: app.jobDetails?.location || app.Job?.location || "Remote",
            salary: app.jobDetails?.salaryRange || app.Job?.salaryRange || "Competitive",
            // Map backend status to UI status
            status: mapBackendStatusToUI(app.status),
            appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
            appliedDateDisplay: getRelativeTime(app.createdAt),
            // Keep original status for reference
            originalStatus: app.status,
          }));
          
          setApplications(transformedApps);
        } else {
          setError(response.data.message || "Failed to fetch applications");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.response?.data?.message || "Failed to fetch applications. Please try again.");
        // Fallback to empty array on error
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Map backend status to UI status
  const mapBackendStatusToUI = (backendStatus) => {
    const statusMap = {
      'applied': 'pending',
      'shortlisted': 'interview',
      'accepted': 'accepted',
      'rejected': 'rejected',
      'withdrawn': 'rejected'
    };
    return statusMap[backendStatus] || 'pending';
  };

  // Get relative time string
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month(s) ago`;
    return `${Math.floor(diffDays / 365)} year(s) ago`;
  };

  const getFilteredApplications = () => {
    if (activeTab === "all") return applications;
    if (activeTab === "pending")
      return applications.filter((a) => a.status === "pending");
    if (activeTab === "interview")
      return applications.filter((a) => a.status === "interview");
    if (activeTab === "accepted")
      return applications.filter((a) => a.status === "accepted");
    if (activeTab === "rejected")
      return applications.filter((a) => a.status === "rejected");
    return applications;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={18} className="text-amber-500" />;
      case "interview":
        return <Calendar size={18} className="text-blue-500" />;
      case "accepted":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "rejected":
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <Briefcase size={18} className="text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "interview":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "interview":
        return "Interview";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const filteredApplications = getFilteredApplications();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 right-0 left-0 h-24 backdrop-blur-xl border-b flex items-center justify-between px-10 md:left-64 z-40 shadow-sm ${
          theme === "dark"
            ? "bg-slate-900/80 border-slate-700"
            : "bg-white/80 border-slate-100"
        }`}
      >
        <h2
          className={`text-2xl font-black tracking-tighter uppercase italic ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}
        >
          My <span className="text-indigo-500">Applications</span>
        </h2>

        <div
          className={`flex items-center gap-4 pl-6 border-l ${
            theme === "dark" ? "border-slate-700" : "border-slate-100"
          }`}
        >
          <div className="text-right hidden sm:block">
            <p
              className={`text-sm font-black leading-none mb-1 ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {user?.username || "Guest"}
            </p>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              {user?.role || "Job Seeker"}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black text-lg">
            {user?.username
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </div>
        </div>
      </header>

      {/* Applications Content */}
      <div className="flex-1 overflow-y-auto p-10 pt-32">
        {/* Tabs */}
        <div
          className={`flex gap-2 mb-10 border-b ${
            theme === "dark" ? "border-slate-700" : "border-slate-100"
          }`}
        >
          {["all", "pending", "interview", "accepted", "rejected"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === tab
                    ? "text-indigo-600 border-indigo-500"
                    : theme === "dark"
                      ? "text-slate-400 border-transparent hover:text-indigo-400"
                      : "text-slate-400 border-transparent hover:text-indigo-500"
                }`}
              >
                {tab === "all" && `All (${applications.length})`}
                {tab === "pending" &&
                  `Pending (${applications.filter((a) => a.status === "pending").length})`}
                {tab === "interview" &&
                  `Interview (${applications.filter((a) => a.status === "interview").length})`}
                {tab === "accepted" &&
                  `Accepted (${applications.filter((a) => a.status === "accepted").length})`}
                {tab === "rejected" &&
                  `Rejected (${applications.filter((a) => a.status === "rejected").length})`}
              </button>
            ),
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
            <p
              className={`font-black uppercase text-sm tracking-widest ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Loading applications...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <AlertCircle
              size={64}
              className="mb-6 text-red-500"
            />
            <h3
              className={`text-2xl font-black mb-4 uppercase tracking-tighter ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              Error Loading Applications
            </h3>
            <p
              className={`font-medium mb-6 ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {error}
            </p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Briefcase
              size={64}
              className={`mb-6 ${
                theme === "dark" ? "text-slate-700" : "text-slate-200"
              }`}
            />
            <h3
              className={`text-2xl font-black mb-4 uppercase tracking-tighter ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {activeTab === "all"
                ? "No Applications Yet"
                : `No ${activeTab} applications`}
            </h3>
            <p
              className={`font-medium ${
                theme === "dark" ? "text-slate-500" : "text-slate-500"
              }`}
            >
              {activeTab === "all"
                ? "Browse jobs and start applying!"
                : `You don't have any ${activeTab} applications.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className={`rounded-[2.5rem] border shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 hover:shadow-indigo-500/10"
                    : "bg-white border-slate-100 hover:shadow-indigo-500/10"
                }`}
              >
                <div className="p-8">
                  {/* Header with Status */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-5">
                      {/* Company Logo */}
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                        {application.company[0]}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-black tracking-tight ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {application.jobTitle}
                        </h3>
                        <p
                          className={`text-sm font-medium ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        >
                          {application.company}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {getStatusIcon(application.status)}
                      <span>{getStatusLabel(application.status)}</span>
                    </div>
                  </div>

                  {/* Application Details Grid */}
                  <div
                    className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 pb-6 ${
                      theme === "dark" ? "border-slate-700" : "border-slate-50"
                    } border-b`}
                  >
                    {/* Location */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-2xl ${
                          theme === "dark" ? "bg-slate-700" : "bg-blue-50"
                        }`}
                      >
                        <MapPin
                          size={18}
                          className={
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-blue-500"
                          }
                        />
                      </div>
                      <div>
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            theme === "dark"
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          LOCATION
                        </p>
                        <p
                          className={`font-bold text-sm ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {application.location}
                        </p>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-2xl ${
                          theme === "dark" ? "bg-slate-700" : "bg-emerald-50"
                        }`}
                      >
                        <DollarSign
                          size={18}
                          className={
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-emerald-500"
                          }
                        />
                      </div>
                      <div>
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            theme === "dark"
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          SALARY
                        </p>
                        <p
                          className={`font-bold text-sm ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {application.salary}
                        </p>
                      </div>
                    </div>

                    {/* Applied Date */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-2xl ${
                          theme === "dark" ? "bg-slate-700" : "bg-purple-50"
                        }`}
                      >
                        <Send
                          size={18}
                          className={
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-purple-500"
                          }
                        />
                      </div>
                      <div>
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            theme === "dark"
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          APPLIED
                        </p>
                        <p
                          className={`font-bold text-sm ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {application.appliedDateDisplay}
                        </p>
                      </div>
                    </div>

                    {/* Interview Date (if applicable) */}
                    {application.status === "interview" && (
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-2xl ${
                            theme === "dark" ? "bg-slate-700" : "bg-blue-50"
                          }`}
                        >
                          <Calendar
                            size={18}
                            className={
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-blue-500"
                            }
                          />
                        </div>
                        <div>
                          <p
                            className={`text-[10px] font-black uppercase tracking-widest ${
                              theme === "dark"
                                ? "text-slate-500"
                                : "text-slate-400"
                            }`}
                          >
                            INTERVIEW
                          </p>
                          <p
                            className={`font-bold text-sm ${
                              theme === "dark" ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {application.interviewDate} at{" "}
                            {application.interviewTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2
                        size={16}
                        className={
                          theme === "dark" ? "text-slate-500" : "text-slate-400"
                        }
                      />
                      <span
                        className={
                          theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }
                      >
                        {application.location}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        View Job
                      </Button>
                      {application.status === "interview" && (
                        <Button size="sm">
                          <Calendar size={16} className="mr-1" />
                          Schedule
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
