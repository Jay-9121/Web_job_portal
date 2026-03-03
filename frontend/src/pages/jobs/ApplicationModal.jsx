import React, { useState, useRef } from "react";
import { X, Plus, Trash2, Loader, Upload } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../../components/ui";

const ApplicationModal = ({ job, onClose, onSubmit, isSubmitting }) => {
  const { theme } = useTheme();
  const [coverLetter, setCoverLetter] = useState("");
  const [qualifications, setQualifications] = useState([""]);
  const [experiences, setExperiences] = useState([
    { position: "", company: "", duration: "" },
  ]);
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState("");
  const fileInputRef = useRef(null);

  const handleAddQualification = () => {
    setQualifications([...qualifications, ""]);
  };

  const handleRemoveQualification = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleUpdateQualification = (index, value) => {
    const updated = [...qualifications];
    updated[index] = value;
    setQualifications(updated);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { position: "", company: "", duration: "" },
    ]);
  };

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  // Handle CV file selection
  const handleCvChange = (e) => {
    const file = e.target.files[0];
    setCvError("");
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setCvError("Invalid file format. Only PDF, DOC, and DOCX files are allowed.");
      setCvFile(null);
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setCvError("File too large. Maximum size is 2MB.");
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  // Remove selected CV
  const handleRemoveCv = () => {
    setCvFile(null);
    setCvError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ApplicationModal handleSubmit clicked", {
      coverLetter,
      qualifications,
      experiences,
      cvFile,
      onSubmit,
    });

    // Validate cover letter
    if (coverLetter.trim().length < 50) {
      alert("Cover letter must be at least 50 characters");
      return;
    }

    // Filter out empty entries
    const filteredSkills = qualifications.filter((q) => q.trim());
    const filteredExperience = experiences.filter((exp) => exp.position || exp.company);

    // Pass data to parent (including CV file)
    if (typeof onSubmit === "function") {
      onSubmit(coverLetter, filteredSkills, filteredExperience, cvFile);
    } else {
      console.warn("ApplicationModal: onSubmit prop not provided or not a function");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
          theme === "dark"
            ? "bg-slate-800 border border-slate-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 flex items-center justify-between p-6 border-b ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Apply for {job?.title}
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              at {job?.companyDetails?.name || "Company"}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              theme === "dark"
                ? "hover:bg-slate-700"
                : "hover:bg-gray-100"
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* CV Upload Section */}
          <div>
            <label
              className={`block text-sm font-bold mb-2 ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Upload Your CV/Resume
            </label>
            <p
              className={`text-xs mb-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Supported formats: PDF, DOC, DOCX (Max 2MB)
            </p>
            
            {!cvFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "border-slate-600 hover:border-slate-500"
                    : "border-gray-300 hover:border-indigo-500"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleCvChange}
                  className="hidden"
                />
                <Upload 
                  size={32} 
                  className={`mx-auto mb-2 ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`} 
                />
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Click to upload your CV/Resume
                </p>
              </div>
            ) : (
              <div
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  theme === "dark"
                    ? "bg-slate-700 border-slate-600"
                    : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-slate-600" : "bg-indigo-100"}`}>
                    <Upload size={20} className={theme === "dark" ? "text-slate-300" : "text-indigo-600"} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {cvFile.name}
                    </p>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {(cvFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCv}
                  className={`p-2 rounded-lg transition ${
                    theme === "dark" 
                      ? "hover:bg-slate-600 text-red-400" 
                      : "hover:bg-indigo-100 text-red-600"
                  }`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            
            {cvError && (
              <p className="text-red-500 text-sm mt-2">{cvError}</p>
            )}
          </div>

          {/* Cover Letter Section */}
          <div>
            <label
              className={`block text-sm font-bold mb-2 ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Why are you a good fit for this role?
            </label>
            <p
              className={`text-xs mb-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Tell the recruiter why you're interested in this position and what
              makes you the right candidate.
            </p>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here... (min 50 characters)"
              required
              minLength={50}
              rows={6}
              className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                theme === "dark"
                  ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {coverLetter.length} characters
            </p>
          </div>

          {/* Qualifications Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className={`block text-sm font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Qualifications & Skills
              </label>
              <button
                type="button"
                onClick={handleAddQualification}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-xs font-bold"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {qualifications.map((qual, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={qual}
                    onChange={(e) =>
                      handleUpdateQualification(index, e.target.value)
                    }
                    placeholder={`e.g., React expertise, 5 years JavaScript`}
                    className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {qualifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className={`block text-sm font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Work Experience
              </label>
              <button
                type="button"
                onClick={handleAddExperience}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-xs font-bold"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          handleUpdateExperience(index, "position", e.target.value)
                        }
                        placeholder="Job Title (e.g., Senior Developer)"
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          theme === "dark"
                            ? "bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          handleUpdateExperience(index, "company", e.target.value)
                        }
                        placeholder="Company Name"
                        className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          theme === "dark"
                            ? "bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) =>
                          handleUpdateExperience(index, "duration", e.target.value)
                        }
                        placeholder="e.g., 2 years, 2020-2022"
                        className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          theme === "dark"
                            ? "bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                  </div>

                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="mt-3 text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting || coverLetter.trim().length < 50}
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : coverLetter.trim().length < 50 ? (
                "Write 50+ chars"
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
