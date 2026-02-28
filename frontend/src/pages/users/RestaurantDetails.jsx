import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Share2,
  Heart,
  Send,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import { Button, Badge, Card } from "../../components/ui";

// Sample job data - in a real app, fetch from API
const sampleJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120,000 - $180,000",
    type: "Full-time",
    category: "Engineering",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    postedDate: "2 days ago",
    applicants: 45,
    description:
      "We are looking for a Senior Software Engineer to join our growing team. You will work on cutting-edge technologies and collaborate with talented engineers.",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "$90,000 - $130,000",
    type: "Full-time",
    category: "Design",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    postedDate: "3 days ago",
    applicants: 32,
    description:
      "Join our design team to create beautiful and intuitive user experiences. Work with cross-functional teams to bring ideas to life.",
  },
];

const JobDetails = ({ user, onLogout, setCurrentPage }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (setCurrentPage) setCurrentPage("");

    // Simulate loading job details
    const timer = setTimeout(() => {
      const foundJob = sampleJobs.find((j) => j.id === parseInt(id));
      setJob(foundJob);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, setCurrentPage]);

  const handleApply = () => {
    toast.success("Application submitted successfully!");
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(
      isSaved ? "Job removed from saved" : "Job saved successfully!",
    );
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin mb-4">⏳</div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          theme === "dark" ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}
    >
      {/* Header with back button */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${
          theme === "dark"
            ? "bg-slate-900/80 border-slate-700"
            : "bg-white/80 border-gray-100"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition ${
                isSaved
                  ? "bg-red-100 text-red-600"
                  : theme === "dark"
                    ? "bg-slate-800 text-slate-400 hover:text-slate-200"
                    : "bg-gray-100 text-gray-600 hover:text-gray-800"
              }`}
            >
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                theme === "dark"
                  ? "bg-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-gray-100 text-gray-600 hover:text-gray-800"
              }`}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Job Header */}
        <Card>
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {job.company}
                </p>
              </div>
            </div>

            {/* Key details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-600" />
                <div>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Location
                  </p>
                  <p className="font-semibold">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-indigo-600" />
                <div>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Salary
                  </p>
                  <p className="font-semibold text-sm">{job.salary}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                <div>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Type
                  </p>
                  <p className="font-semibold">{job.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                <div>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Applicants
                  </p>
                  <p className="font-semibold">{job.applicants}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">About the Role</h2>
              <p
                className={`leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-gray-700"
                }`}
              >
                {job.description}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <Badge key={idx} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Send size={18} className="mr-2" />
                Apply Now
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default JobDetails;
