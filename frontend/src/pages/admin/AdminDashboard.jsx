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
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getDashboardStats,
  getAllUsers,
  getAllBookings,
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
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    document.title = `Admin - ${activeTab}`;
  }, [activeTab]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Using sample data for demonstration since we're converting to job portal
        setTimeout(() => {
          setStats([
            {
              label: "Total Users",
              value: "1,234",
              icon: Users,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              trend: "+12%",
              trendUp: true,
            },
            {
              label: "Active Jobs",
              value: "567",
              icon: Briefcase,
              color: "text-blue-600",
              bg: "bg-blue-50",
              trend: "+8%",
              trendUp: true,
            },
            {
              label: "Companies",
              value: "89",
              icon: Building2,
              color: "text-purple-600",
              bg: "bg-purple-50",
              trend: "+15%",
              trendUp: true,
            },
            {
              label: "Applications",
              value: "2,456",
              icon: FileText,
              color: "text-rose-600",
              bg: "bg-rose-50",
              trend: "+25%",
              trendUp: true,
            },
          ]);
          setLoading(false);
        }, 800);

        // Sample recent applications
        setRecentApplications([
          {
            id: 1,
            applicantName: "John Smith",
            jobTitle: "Senior Software Engineer",
            company: "TechCorp Inc.",
            status: "pending",
            appliedDate: "2 hours ago",
          },
          {
            id: 2,
            applicantName: "Sarah Johnson",
            jobTitle: "Product Designer",
            company: "DesignHub",
            status: "accepted",
            appliedDate: "5 hours ago",
          },
          {
            id: 3,
            applicantName: "Mike Davis",
            jobTitle: "Marketing Manager",
            company: "GrowthBox",
            status: "pending",
            appliedDate: "1 day ago",
          },
          {
            id: 4,
            applicantName: "Emily Brown",
            jobTitle: "Data Analyst",
            company: "DataDriven",
            status: "rejected",
            appliedDate: "2 days ago",
          },
          {
            id: 5,
            applicantName: "Alex Wilson",
            jobTitle: "Frontend Developer",
            company: "WebSolutions",
            status: "pending",
            appliedDate: "3 days ago",
          },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard stats");
        setLoading(false);
      }
    };

    if (activeTab === "Dashboard") {
      fetchStats();
    }
  }, [activeTab]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", label: "Pending", icon: Clock },
      accepted: { variant: "success", label: "Shortlisted", icon: CheckCircle },
      rejected: { variant: "danger", label: "Rejected", icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
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
                  <button className="text-indigo-600 text-sm font-bold">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
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
                          const initials = getInitials(app.applicantName);
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
                                    {app.applicantName}
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
                                {app.jobTitle}
                              </td>
                              <td
                                className={`py-4 text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {app.company}
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
                                {app.appliedDate}
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
                </div>
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
                        Active Job Seekers
                      </span>
                      <span className="font-black">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Companies Hiring</span>
                      <span className="font-black">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">
                        Interviews This Week
                      </span>
                      <span className="font-black">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Jobs Filled</span>
                      <span className="font-black">45</span>
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
                    <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
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
    </div>
  );
};

export default AdminDashboard;
