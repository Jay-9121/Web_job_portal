import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Search,
  ArrowRight,
  Menu,
  Sun,
  Moon,
  Building2,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { getPublicStats } from "../../services/api";
import {
  Button,
  Card,
} from "../../components/ui";

// Sample job data for demonstration (since we're converting from restaurant)
const sampleJobs = [];

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({
    activeJobs: 0,
    jobSeekers: 0,
    companies: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await getPublicStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      {/* ============== HERO SECTION ============== */}
      <div className="relative min-h-[80vh] bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 flex flex-col overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -top-32 -left-32 animate-pulse"></div>
          <div className="absolute w-[300px] h-[300px] bg-indigo-300/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-700"></div>
          <div className="absolute w-[200px] h-[200px] bg-blue-300/10 rounded-full blur-2xl top-1/2 left-1/2 animate-pulse delay-500"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-[60] flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              JOB<span className="text-indigo-200">HUNT</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-white/90 hover:text-white font-bold text-sm uppercase tracking-wider transition-colors"
            >
              Sign In
            </button>
            {/* Post a Job removed from public home. Companies post via admin panel. */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 text-white">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-indigo-600 z-50 p-6 space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-left text-white font-bold uppercase tracking-wider py-2"
            >
              Sign In
            </button>
            {/* Post a Job removed from mobile menu */}
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-indigo-100 text-xs font-bold uppercase tracking-widest">
              500+ Active Jobs
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[0.95]">
            FIND YOUR
            <br />
            <span className="text-indigo-200">DREAM</span> JOB
          </h1>

          <p className="text-indigo-100 text-lg md:text-xl font-medium max-w-2xl mb-10 leading-relaxed">
            Discover thousands of job opportunities from top companies. Your
            next career move starts here.
          </p>

          {/* Search Bar with CTA */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/jobs")}
                size="lg" 
                className="px-12 py-4 text-lg font-black"
              >
                Explore All Jobs <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button 
                onClick={() => navigate("/login")}
                size="lg" 
                variant="secondary"
                className="px-12 py-4 text-lg font-black border-white/30 text-white hover:bg-white/10"
              >
                Sign In to Apply
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-indigo-200 font-medium">Browse Jobs:</span>
            {[
              "Software Engineer",
              "Product Designer",
              "Marketing",
              "Data Analyst",
            ].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/jobs?search=${term}`)}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors text-xs font-semibold"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 px-6 pb-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard 
              icon={Briefcase} 
              label="Active Jobs" 
              value={statsLoading ? "..." : stats.activeJobs.toLocaleString()} 
            />
            <StatCard 
              icon={Users} 
              label="Job Seekers" 
              value={statsLoading ? "..." : stats.jobSeekers.toLocaleString()} 
            />
            <StatCard 
              icon={Building2} 
              label="Companies" 
              value={statsLoading ? "..." : stats.companies.toLocaleString()} 
            />
          </div>
        </div>
      </div>

      {/* ============== CTA SECTION ============== */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            Ready to Launch Your Career?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of job seekers who found their dream jobs through
            JobHunt. Create your profile today and get discovered by top
            companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Create Free Account
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="secondary"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="py-12 px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tighter">
                  JOB<span className="text-indigo-400">HUNT</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Your trusted platform for finding the perfect job match.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Companies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Salaries
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">For Employers</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} JobHunt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ============== STAT CARD COMPONENT ============== */
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/20 flex items-center gap-4 hover:bg-white/15 transition-colors">
    <div className="bg-white/20 p-3 rounded-xl text-white">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-white/60 text-xs font-bold uppercase tracking-[0.15em] mb-0.5">
        {label}
      </p>
      <h4 className="text-xl md:text-2xl font-black text-white leading-none">
        {value}
      </h4>
    </div>
  </div>
);

export default Home;
