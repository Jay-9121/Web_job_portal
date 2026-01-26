import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  Search, Bell, Briefcase, Clock, ChevronRight, 
  Trophy, LayoutDashboard, User, Settings, LogOut, 
  Filter, MapPin, DollarSign 
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      try {
        const response = await axios.get("http://localhost:3000/api/user/getme", config);
        if (response.data.success) setUser(response.data.user);
      } catch (err) {
        navigate("/login");
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [navigate]);

  const stats = [
    { label: "Applied Jobs", value: "08", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Interviews", value: "02", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Profile Views", value: "124", icon: User, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Skill Score", value: "85%", icon: Trophy, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const recentApplications = [
    { id: "APP-102", company: "TechCorp Inc.", role: "Frontend Dev", date: "Jan 24, 2024", status: "Reviewing", salary: "$5k - $7k" },
    { id: "APP-105", company: "Global Solutions", role: "UI Designer", date: "Jan 20, 2024", status: "Interview", salary: "$4k - $6k" },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#1f1b1b] text-white">Loading PathVista...</div>;

  return (
    <div className="flex min-h-screen bg-[#f5f5f4]">
      {/* Sidebar Navigation - Using your color scheme */}
      <aside className="w-64 bg-[#2a2420] text-white hidden md:flex flex-col fixed h-full shadow-2xl">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-[#fbbf24] tracking-tight">PathVista</h1>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1">Your Journey to Opportunity</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { name: "Dashboard", icon: LayoutDashboard },
            { name: "Jobs", icon: Briefcase },
            { name: "Profile", icon: User },
            { name: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.name ? "bg-[#a16207] text-white shadow-lg" : "text-gray-400 hover:bg-[#3b2f2f] hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          className="m-6 flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">{activeTab} Overview</h2>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search for jobs..." className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#a16207]" />
            </div>
            
            <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{user?.username}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Job Seeker</p>
              </div>
              <div className="w-10 h-10 bg-[#a16207] rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {user?.username?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Welcome Message */}
          <div className="bg-[#2a2420] p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-2">Hello, {user?.username}! 👋</h3>
              <p className="text-gray-300 max-w-md">Your profile is 85% complete. Adding your latest projects could increase your interview chances by 40%.</p>
              <button className="mt-6 bg-[#fbbf24] text-[#2a2420] px-6 py-2 rounded-xl font-bold hover:bg-white transition-colors">Complete Profile</button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:translate-y-[-4px] transition-all">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}><stat.icon size={22} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recent Applications</h3>
                <button className="text-[#a16207] text-sm font-bold flex items-center gap-1">View All <ChevronRight size={16}/></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold">
                    <tr>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-800">{app.role}</p>
                          <p className="text-xs text-gray-500">{app.company}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${app.status === 'Interview' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{app.salary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Skills Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase"><span>JavaScript</span><span>80%</span></div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-[#a16207] h-1.5 rounded-full" style={{width: '80%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase"><span>Node.js</span><span>65%</span></div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-[#fbbf24] h-1.5 rounded-full" style={{width: '65%'}}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;