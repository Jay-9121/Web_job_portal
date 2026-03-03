import React, { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  BarChart2,
  TrendingUp,
  ArrowUpRight,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Settings,
  Plus,
  X,
  Calendar,
  DollarSign,
  Star,
  Utensils,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getDashboardStats,
  getAllApplications,
  createJob,
  getMe,
} from "../../services/api";
import { getInitials } from "../../helpers/getInitials";
import { useTheme } from "../../context/ThemeContext";
import { Card, Badge, Button, Spinner } from "../../components/ui";

const AdminDashboard = ({ onLogout }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState([
    {
      label: "Total Users",
      value: "0",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Active Jobs",
      value: "0",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Companies",
      value: "0",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+18%",
      trendUp: true,
    },
    {
      label: "Applications",
      value: "0",
      icon: FileText,
      color: "text-rose-600",
      bg: "bg-rose-50",
      trend: "+25%",
      trendUp: true,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [selectedApplicationForDetail, setSelectedApplicationForDetail] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryRange: "",
    minSalary: "",
    maxSalary: "",
    skillsRequired: "",
    vacancies: 1,
  });

  // Additional stats state
  const [platformStats, setPlatformStats] = useState({
    totalRestaurants: 0,
    totalBookings: 0,
    pendingBookings: 0,
    bookingsToday: 0,
    totalRevenue: 0,
    totalReviews: 0,
    averageRating: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loadingPlatformStats, setLoadingPlatformStats] = useState(false);

  useEffect(() => {
    document.title = `Admin - ${activeTab}`;
  }, [activeTab]);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user info
      try {
        const userResponse = await getMe();
        if (userResponse.data.success) {
          setUser(userResponse.data.user);
        }
      } catch (userError) {
        console.error("Error fetching user info:", userError);
        toast.error("Failed to load user information");
      }

      // Fetch dashboard stats
      try {
        const statsResponse = await getDashboardStats();
        if (statsResponse.data.success) {
          const { 
            totalUsers, 
            activeJobs, 
            totalCompanies, 
            totalApplications,
            totalRestaurants,
            totalBookings,
            pendingBookings,
            bookingsToday,
            totalRevenue,
            totalReviews,
            averageRating
          } = statsResponse.data.stats;

          setStats([
            {
              label: "Total Users",
              value: totalUsers.toString(),
              icon: Users,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              trend: "+12%",
              trendUp: true,
            },
            {
              label: "Active Jobs",
              value: activeJobs.toString(),
              icon: Briefcase,
              color: "text-blue-600",
              bg: "bg-blue-50",
              trend: "+8%",
              trendUp: true,
            },
            {
              label: "Companies",
              value: totalCompanies.toString(),
              icon: Building2,
              color: "text-purple-600",
              bg: "bg-purple-50",
              trend: "+15%",
              trendUp: true,
            },
            {
              label: "Applications",
              value: totalApplications.toString(),
              icon: FileText,
              color: "text-rose-600",
              bg: "bg-rose-50",
              trend: "+25%",
              trendUp: true,
            },
          ]);

          // Set platform stats (restaurants, bookings, reviews)
          setPlatformStats({
            totalRestaurants: totalRestaurants || 0,
            totalBookings: totalBookings || 0,
            pendingBookings: pendingBookings || 0,
            bookingsToday: bookingsToday || 0,
            totalRevenue: totalRevenue || 0,
            totalReviews: totalReviews || 0,
            averageRating: averageRating || 0,
          });
        }
      } catch (statsError) {
        console.error("Error fetching stats:", statsError);
        const errorMsg = statsError.response?.data?.message || "Failed to load dashboard statistics";
        toast.error(errorMsg);
      }



      // Fetch recent applications
      if (activeTab === "Dashboard") {
        try {
          const appResponse = await getAllApplications({ page: 1, limit: 5 });
          if (appResponse.data.success) {
            setRecentApplications(appResponse.data.applications);
          }
        } catch (appError) {
          console.error("Error fetching applications:", appError);
          toast.error("Failed to load applications");
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Unexpected error in fetchDashboardData:", error);
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleJobInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();

    if (!jobForm.title || !jobForm.description || !jobForm.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setJobSubmitting(true);

      const submitData = {
        ...jobForm,
        skillsRequired: jobForm.skillsRequired
          ? jobForm.skillsRequired.split(",").map((s) => s.trim())
          : [],
        minSalary: jobForm.minSalary ? parseInt(jobForm.minSalary) : null,
        maxSalary: jobForm.maxSalary ? parseInt(jobForm.maxSalary) : null,
        vacancies: parseInt(jobForm.vacancies) || 1,
      };

      const response = await createJob(submitData);

      if (response.data.success) {
        toast.success("Job created successfully!");
        setShowJobModal(false);
        setJobForm({
          title: "",
          description: "",
          location: "",
          jobType: "full-time",
          experienceLevel: "mid",
          salaryRange: "",
          minSalary: "",
          maxSalary: "",
          skillsRequired: "",
          vacancies: 1,
        });
        // Refresh dashboard
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error creating job:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        fullError: error
      });
      const errorMsg = error.response?.data?.message || "Failed to create job. Please try again.";
      toast.error(errorMsg);
    } finally {
      setJobSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { variant: "warning", label: "Applied", icon: Clock },
      shortlisted: {
        variant: "success",
        label: "Shortlisted",
        icon: CheckCircle,
      },
      accepted: { variant: "success", label: "Accepted", icon: CheckCircle },
      rejected: { variant: "danger", label: "Rejected", icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.applied;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading
                ? [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-white animate-pulse rounded-2xl border border-gray-100"
                    />
                  ))
                : stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`${stat.bg} p-3 rounded-xl`}>
                          <stat.icon className={`${stat.color} w-6 h-6`} />
                        </div>
                        {stat.trend && (
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                              stat.trendUp
                                ? "text-emerald-600 bg-emerald-50"
                                : "text-rose-600 bg-rose-50"
                            }`}
                          >
                            {stat.trend}
                            <ArrowUpRight
                              className={`w-3 h-3 ${stat.trendUp ? "" : "rotate-180"}`}
                            />
                          </span>
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-black tracking-tight ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stat.value}
                        </h3>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Recent Applications & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className={`lg:col-span-2 rounded-2xl border shadow-sm p-6 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Recent Applications
                  </h3>
                  <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700">
                    View All
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-200 animate-pulse rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr
                        className={`text-xs uppercase border-b ${
                          theme === "dark"
                            ? "text-gray-400 border-slate-700"
                            : "text-gray-400 border-gray-50"
                        }`}
                      >
                        <th className="pb-3 font-semibold">Applicant</th>
                        <th className="pb-3 font-semibold">Job</th>
                        <th className="pb-3 font-semibold">Company</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">
                          Applied
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentApplications.length > 0 ? (
                        recentApplications.map((app) => {
                          const initials = getInitials(app.applicant?.username || "U");
                          return (
                            <tr
                              key={app.id}
                              className="group hover:bg-indigo-50/30"
                            >
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                    {initials}
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {app.applicant?.username || "Unknown"}
                                  </span>
                                </div>
                              </td>
                              <td
                                className={`py-4 text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {app.Job?.title}
                              </td>
                              <td
                                className={`py-4 text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {app.Job?.Company?.name || "Company"}
                              </td>
                              <td className="py-4">
                                {getStatusBadge(app.status)}
                              </td>
                              <td
                                className={`py-4 text-right text-sm font-medium ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                <div className="flex flex-col items-end">
                                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                  <button
                                    onClick={() => setSelectedApplicationForDetail(app)}
                                    className="text-xs text-indigo-600 hover:underline mt-1"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-6 text-center text-gray-500"
                          >
                            No applications yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Quick Actions & Tips */}
              <div className="space-y-6">
                {/* Quick Stats Card */}
                <div
                  className={`rounded-2xl p-6 ${
                    theme === "dark"
                      ? "bg-slate-800 border border-slate-700"
                      : "bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
                  }`}
                >
                  <h3 className="font-bold text-lg mb-4">Platform Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">
                        <Utensils className="w-4 h-4 inline mr-1" />
                        Restaurants
                      </span>
                      <span className="font-black">{platformStats.totalRestaurants}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Total Bookings
                      </span>
                      <span className="font-black">{platformStats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Pending Bookings
                      </span>
                      <span className="font-black">{platformStats.pendingBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Total Revenue
                      </span>
                      <span className="font-black">${platformStats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">
                        <Star className="w-4 h-4 inline mr-1" />
                        Reviews
                      </span>
                      <span className="font-black">{platformStats.totalReviews}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <Card
                  className={
                    theme === "dark" ? "bg-slate-800 border-slate-700" : ""
                  }
                >
                  <h3
                    className={`font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button onClick={() => setShowJobModal(true)} className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                      <Plus size={18} />
                      <span className="font-bold text-sm">Add New Job</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                      <Users size={18} />
                      <span className="font-bold text-sm">Manage Users</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                      <BarChart2 size={18} />
                      <span className="font-bold text-sm">View Reports</span>
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      
      // Application Detail Drawer
      if (selectedApplicationForDetail) {
        const app = selectedApplicationForDetail;
        return (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-t-xl md:rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Application Details</h3>
                  <p className="text-sm text-gray-500">{app.applicant?.username} applied for {app.jobDetails?.title}</p>
                </div>
                <button onClick={() => setSelectedApplicationForDetail(null)} className="text-gray-500 hover:text-gray-700">Close</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold">Cover Letter</h4>
                  <div className="mt-2 bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">{app.coverLetter || "No cover letter provided"}</div>
                </div>

                {app.skills && app.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Skills & Qualifications</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                      {app.skills.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}

                {app.experience && app.experience.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Work Experience</h4>
                    <div className="mt-2 space-y-2">
                      {app.experience.map((e, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium">{e.position}</p>
                          <p className="text-gray-600 text-sm">{e.company} • {e.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Applied</p>
                    <p className="font-medium">{new Date(app.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(app.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "Users":
        return (
          <Card
            className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
          >
            <h2
              className={`text-2xl font-black mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              User Management
            </h2>
            <p className="text-gray-500">
              User management interface coming soon...
            </p>
          </Card>
        );
      case "Jobs":
        return (
          <Card
            className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
          >
            <h2
              className={`text-2xl font-black mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Job Management
            </h2>
            <p className="text-gray-500">
              Job management interface coming soon...
            </p>
          </Card>
        );
      case "Companies":
        return (
          <Card
            className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
          >
            <h2
              className={`text-2xl font-black mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Company Management
            </h2>
            <p className="text-gray-500">
              Company management interface coming soon...
            </p>
          </Card>
        );
      case "Settings":
        return (
          <Card
            className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
          >
            <h2
              className={`text-2xl font-black mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Settings
            </h2>
            <p className="text-gray-500">Settings panel coming soon...</p>
          </Card>
        );
      default:
        return <p>Content not found.</p>;
    }
  };

  return (
    <div
      className={`flex min-h-screen ${
        theme === "dark" ? "bg-slate-900" : "bg-slate-50"
      } font-sans transition-colors duration-300`}
    >
      <AdminNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1
              className={`text-3xl font-black ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {activeTab}
            </h1>
            <p className="text-gray-500 text-sm">Dashboard / {activeTab}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              className={`relative p-2 rounded-xl transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:bg-slate-800"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        <section>{renderContent()}</section>
      </main>

      {/* Job Creation Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex justify-between items-center p-6 border-b ${
                theme === "dark"
                  ? "border-slate-700 text-white"
                  : "border-gray-100"
              }`}
            >
              <h2 className="text-2xl font-bold">Create New Job</h2>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={jobForm.title}
                  onChange={handleJobInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="e.g., Senior React Developer"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="Enter job description"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleJobInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="e.g., Remote"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={jobForm.jobType}
                    onChange={handleJobInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={jobForm.experienceLevel}
                    onChange={handleJobInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Vacancies
                  </label>
                  <input
                    type="number"
                    name="vacancies"
                    value={jobForm.vacancies}
                    onChange={handleJobInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="minSalary"
                    value={jobForm.minSalary}
                    onChange={handleJobInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="maxSalary"
                    value={jobForm.maxSalary}
                    onChange={handleJobInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="80000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Skills Required (comma separated)
                </label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={jobForm.skillsRequired}
                  onChange={handleJobInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={jobSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {jobSubmitting ? (
                    <>
                      <Spinner size={16} />
                      Creating...
                    </>
                  ) : (
                    "Create Job"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
