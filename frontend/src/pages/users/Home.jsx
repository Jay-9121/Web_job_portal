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
  Star,
  Filter,
  X,
  Menu,
  Sun,
  Moon,
  Building2,
  Heart,
  Bookmark,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import {
  Button,
  Card,
  Badge,
  Input,
  Textarea,
  Modal,
  Spinner,
} from "../../components/ui";

// Sample job data for demonstration (since we're converting from restaurant)
const sampleJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    companyLogo: null,
    location: "San Francisco, CA",
    salary: "$120,000 - $180,000",
    type: "Full-time",
    category: "Engineering",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    postedDate: "2 days ago",
    applicants: 45,
    description:
      "We are looking for a Senior Software Engineer to join our growing team...",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignHub",
    companyLogo: null,
    location: "Remote",
    salary: "$90,000 - $130,000",
    type: "Full-time",
    category: "Design",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    postedDate: "3 days ago",
    applicants: 32,
    description:
      "Join our design team to create beautiful and intuitive user experiences...",
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "GrowthBox",
    companyLogo: null,
    location: "New York, NY",
    salary: "$80,000 - $110,000",
    type: "Full-time",
    category: "Marketing",
    skills: ["SEO", "Content Marketing", "Analytics", "Campaign Management"],
    postedDate: "1 week ago",
    applicants: 28,
    description: "Lead our marketing initiatives and drive brand awareness...",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "DataDriven",
    companyLogo: null,
    location: "Austin, TX",
    salary: "$70,000 - $95,000",
    type: "Full-time",
    category: "Data",
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    postedDate: "5 days ago",
    applicants: 19,
    description:
      "Analyze data and provide insights to drive business decisions...",
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "WebSolutions",
    companyLogo: null,
    location: "Remote",
    salary: "$80,000 - $120,000",
    type: "Contract",
    category: "Engineering",
    skills: ["React", "Vue.js", "CSS", "JavaScript"],
    postedDate: "1 day ago",
    applicants: 56,
    description: "Build responsive and performant web applications...",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "CloudFirst",
    companyLogo: null,
    location: "Seattle, WA",
    salary: "$130,000 - $170,000",
    type: "Full-time",
    category: "Engineering",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    postedDate: "4 days ago",
    applicants: 23,
    description: "Manage cloud infrastructure and deployment pipelines...",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    salaryRange: "",
    category: "",
    skills: [],
  });

  // Apply modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    linkedIn: "",
    portfolio: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return sampleJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesType = !filters.jobType || job.type === filters.jobType;
      const matchesLocation =
        !filters.location ||
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCategory =
        !filters.category || job.category === filters.category;

      return matchesSearch && matchesType && matchesLocation && matchesCategory;
    });
  }, [searchTerm, filters]);

  const handleSaveJob = (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
      toast.info("Job removed from saved");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Job saved successfully!");
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(`Application submitted for ${selectedJob.title}!`);
    setSubmitting(false);
    setShowApplyModal(false);
    setApplicationData({
      coverLetter: "",
      linkedIn: "",
      portfolio: "",
      phone: "",
    });
  };

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
  ];
  const categories = [
    "Engineering",
    "Design",
    "Marketing",
    "Data",
    "Sales",
    "HR",
  ];
  const locations = [
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
  ];

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
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Post a Job
            </button>
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
            <button
              onClick={() => navigate("/register")}
              className="block w-full text-left bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold uppercase tracking-wider"
            >
              Post a Job
            </button>
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

          {/* Search Bar */}
          <div className="w-full max-w-4xl relative">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-5 py-4.5 bg-white rounded-2xl text-slate-800 text-base outline-none shadow-2xl focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
              <div className="relative md:w-64">
                <MapPin
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="City or Remote"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full pl-14 pr-5 py-4.5 bg-white rounded-2xl text-slate-800 text-base outline-none shadow-2xl focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
              <Button className="py-4.5 px-10 shadow-xl">Search Jobs</Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-indigo-200 font-medium">Popular:</span>
            {[
              "Software Engineer",
              "Product Designer",
              "Marketing",
              "Data Analyst",
            ].map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 px-6 pb-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Briefcase} label="Active Jobs" value="2,500+" />
            <StatCard icon={Building2} label="Companies" value="500+" />
            <StatCard icon={Users} label="Job Seekers" value="50K+" />
            <StatCard icon={CheckCircle} label="Hired" value="25K+" />
          </div>
        </div>
      </div>

      {/* ============== JOB LISTINGS SECTION ============== */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside
              className={`lg:w-80 ${showFilters ? "block" : "hidden"} lg:block`}
            >
              <Card padding="lg" className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-900">Filters</h3>
                  <button
                    onClick={() =>
                      setFilters({
                        jobType: "",
                        location: "",
                        salaryRange: "",
                        category: "",
                        skills: [],
                      })
                    }
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Job Type
                  </h4>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="jobType"
                          checked={filters.jobType === type}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              jobType: e.target.checked ? type : "",
                            })
                          }
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Salary Range
                  </h4>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) =>
                      setFilters({ ...filters, salaryRange: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-slate-800 focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="">Any Salary</option>
                    <option value="0-50000">$0 - $50,000</option>
                    <option value="50000-80000">$50,000 - $80,000</option>
                    <option value="80000-120000">$80,000 - $120,000</option>
                    <option value="120000-999999">$120,000+</option>
                  </select>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Category
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            category: filters.category === cat ? "" : cat,
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          filters.category === cat
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Location
                  </h4>
                  <div className="space-y-2">
                    {locations.map((loc) => (
                      <label
                        key={loc}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="location"
                          checked={filters.location === loc}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              location: e.target.checked ? loc : "",
                            })
                          }
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                          {loc}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {filteredJobs.length} Jobs Found
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {searchTerm
                      ? `Showing results for "${searchTerm}"`
                      : "All open positions"}
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm"
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : (
                /* Jobs Grid */
                <div className="grid gap-5">
                  {filteredJobs.map((job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      saved={savedJobs.includes(job.id)}
                      onSave={(e) => handleSaveJob(job.id, e)}
                      onApply={() => handleApply(job)}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {filteredJobs.length === 0 && !loading && (
                <Card className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-slate-500">
                    Try adjusting your search or filters
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

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

      {/* ============== APPLY MODAL ============== */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply for ${selectedJob?.title}`}
        size="lg"
      >
        <form onSubmit={submitApplication} className="space-y-5">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xl">
                {selectedJob?.company?.[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">
                  {selectedJob?.company}
                </h4>
                <p className="text-sm text-slate-600">
                  {selectedJob?.location}
                </p>
              </div>
            </div>
          </div>

          <Textarea
            label="Cover Letter"
            placeholder="Tell us why you're a great fit for this role..."
            value={applicationData.coverLetter}
            onChange={(e) =>
              setApplicationData({
                ...applicationData,
                coverLetter: e.target.value,
              })
            }
            rows={4}
            required
          />

          <Input
            label="LinkedIn Profile"
            placeholder="https://linkedin.com/in/yourprofile"
            value={applicationData.linkedIn}
            onChange={(e) =>
              setApplicationData({
                ...applicationData,
                linkedIn: e.target.value,
              })
            }
          />

          <Input
            label="Portfolio / GitHub"
            placeholder="https://yourportfolio.com"
            value={applicationData.portfolio}
            onChange={(e) =>
              setApplicationData({
                ...applicationData,
                portfolio: e.target.value,
              })
            }
          />

          <Input
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={applicationData.phone}
            onChange={(e) =>
              setApplicationData({ ...applicationData, phone: e.target.value })
            }
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowApplyModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ============== SUB-COMPONENTS ============== */
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

const JobCard = ({ job, saved, onSave, onApply, index }) => (
  <div
    className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-start gap-5">
      {/* Company Logo */}
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-indigo-500/20">
        {job.company[0]}
      </div>

      {/* Job Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-slate-600 font-medium">{job.company}</p>
          </div>
          <button
            onClick={onSave}
            className={`p-2 rounded-lg transition-all ${saved ? "text-rose-500 bg-rose-50" : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"}`}
          >
            <Heart size={20} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin size={16} />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign size={16} />
            {job.salary}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            {job.postedDate}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} />
            <span>{job.applicants} applicants</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={onSave}>
              Save
            </Button>
            <Button size="sm" onClick={onApply}>
              Apply Now <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
