import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createJob, getMe } from "../../services/api";

export default function PostJob() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salaryRange: "",
    minSalary: "",
    maxSalary: "",
    location: "",
    jobType: "full-time",
    skillsRequired: "",
    experienceLevel: "mid",
    vacancies: 1,
  });

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const response = await getMe();
      if (response.data.success) {
        setUser(response.data.user);
        if (response.data.user.role !== "company") {
          alert("Only company representatives can post jobs");
          navigate("/");
        }
      }
    } catch (err) {
      alert("Please log in to post a job");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.location
    ) {
      setError("Title, description, and location are required");
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        skillsRequired: formData.skillsRequired
          ? formData.skillsRequired.split(",").map((s) => s.trim())
          : [],
        minSalary: formData.minSalary ? parseInt(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : null,
        vacancies: parseInt(formData.vacancies) || 1,
      };

      const response = await createJob(submitData);

      if (response.data.success) {
        alert("Job posted successfully!");
        navigate("/company/jobs");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the job responsibilities, requirements, and benefits..."
            rows="6"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., New York, Remote, Hybrid"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-semibold mb-2">Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Min Salary ($)
            </label>
            <input
              type="number"
              name="minSalary"
              value={formData.minSalary}
              onChange={handleInputChange}
              placeholder="50000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Max Salary ($)
            </label>
            <input
              type="number"
              name="maxSalary"
              value={formData.maxSalary}
              onChange={handleInputChange}
              placeholder="100000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Salary Range Text */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Salary Range Display
          </label>
          <input
            type="text"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleInputChange}
            placeholder="e.g., $50,000 - $100,000/year"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Skills Required */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Required Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleInputChange}
            placeholder="e.g., JavaScript, React, Node.js, PostgreSQL"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Vacancies */}
        <div>
          <label className="block text-sm font-semibold mb-2">Vacancies</label>
          <input
            type="number"
            name="vacancies"
            value={formData.vacancies}
            onChange={handleInputChange}
            min="1"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {submitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
