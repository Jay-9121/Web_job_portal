import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Users, Briefcase, Trash2, LayoutDashboard, 
  LogOut, ShieldCheck, Plus, UserX 
} from "lucide-react";
import { getUser, deleteUserById } from "../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get admin info from localStorage
  const adminData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (activeTab === "Manage Users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUser();
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, role) => {
    if (role === 'admin') return toast.error("Cannot delete an admin account");
    
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const response = await deleteUserById(id);
        if (response.data.success) {
          toast.success("User removed successfully");
          fetchUsers(); // Refresh list
        }
      } catch (error) {
        toast.error("Error deleting user");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-[#f5f5f4]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f1b1b] border-r border-[#3b2f2f] flex flex-col fixed h-full">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-[#fbbf24]">PathVista</h1>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase">Admin Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: "Overview", icon: LayoutDashboard, label: "Overview" },
            { id: "Manage Users", icon: Users, label: "Users List" },
            { id: "Manage Jobs", icon: Briefcase, label: "Job Listings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? "bg-[#a16207] text-white shadow-lg" 
                : "text-gray-400 hover:bg-[#2a2420] hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="m-6 flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">{activeTab}</h2>
            <p className="text-gray-400 text-sm">System Administration & Control</p>
          </div>
          <div className="flex items-center gap-4 bg-[#2a2420] p-3 rounded-2xl border border-[#3b2f2f]">
            <ShieldCheck className="text-[#fbbf24]" size={24} />
            <div className="text-right">
              <p className="text-xs font-bold leading-none">{adminData?.username}</p>
              <p className="text-[10px] text-amber-500 uppercase">System Root</p>
            </div>
          </div>
        </header>

        {/* Dynamic Sections */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#a16207] to-[#78350f] p-8 rounded-3xl shadow-xl col-span-2">
              <h3 className="text-2xl font-bold mb-2">Welcome Back, Command.</h3>
              <p className="text-amber-100 opacity-80">The system is running optimally. You have full oversight of all users and active job postings.</p>
            </div>
            <div className="bg-[#1f1b1b] p-8 rounded-3xl border border-[#3b2f2f] flex flex-col justify-center items-center">
              <Users size={32} className="text-[#fbbf24] mb-2" />
              <p className="text-gray-400 text-xs uppercase font-bold">Total Platform Users</p>
              <p className="text-4xl font-black">{users.length || "..."}</p>
            </div>
          </div>
        )}

        {activeTab === "Manage Users" && (
          <div className="bg-[#1f1b1b] rounded-2xl border border-[#3b2f2f] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-[#2a2420] text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b2f2f]">
                {loading ? (
                   <tr><td colSpan="4" className="text-center py-10">Loading users...</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#25201e] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold">{u.username}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-amber-900/50 text-amber-400' : 'bg-blue-900/50 text-blue-400'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-xs text-emerald-500">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.role)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2"
                        >
                          <UserX size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Manage Jobs" && (
          <div className="flex flex-col items-center justify-center py-20 bg-[#1f1b1b] border-2 border-dashed border-[#3b2f2f] rounded-3xl">
            <Briefcase size={48} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Platform Job Listings</h3>
            <p className="text-gray-500 mb-6">Manage all job posts from this panel.</p>
            <button className="flex items-center gap-2 bg-[#a16207] text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
              <Plus size={20} /> Create New Job
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;