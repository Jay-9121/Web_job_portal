import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createUserApi } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.username.trim()) { toast.error("Username is required"); return false; }
    if (!formData.email.trim()) { toast.error("Email is required"); return false; }
    if (!formData.password || formData.password.length < 6) { toast.error("Password too short"); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await createUserApi({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      if (response?.data?.success) {
        toast.success("Registration successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-linear-to-br from-[#3b2f2f] to-[#1f1b1b]">
      <form onSubmit={handleSubmit} className="w-90 p-8 rounded-2xl bg-[#2a2420] shadow-[0_18px_40px_rgba(0,0,0,0.6)]">
        <h2 className="text-[#f5f5f4] text-center mb-1 text-2xl font-bold">Create Account</h2>
        <p className="text-[#d6d3d1] text-center mb-6 text-sm">Sign up to get started</p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-xl border border-[#7c6f64] bg-[#1f1b1b] text-[#f5f5f4] outline-hidden focus:ring-2 focus:ring-[#a16207] transition-all"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-xl border border-[#7c6f64] bg-[#1f1b1b] text-[#f5f5f4] outline-hidden focus:ring-2 focus:ring-[#a16207] transition-all"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-xl border border-[#7c6f64] bg-[#1f1b1b] text-[#f5f5f4] outline-hidden focus:ring-2 focus:ring-[#a16207] transition-all"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mb-5 rounded-xl border border-[#7c6f64] bg-[#1f1b1b] text-[#f5f5f4] outline-hidden focus:ring-2 focus:ring-[#a16207] transition-all"
        />

        <button type="submit" className="w-full p-3 rounded-xl bg-linear-to-r from-[#a16207] to-[#92400e] text-[#fafaf9] font-bold text-base cursor-pointer hover:brightness-110 transition-all active:scale-95">
          Register
        </button>

        <p className="text-[#d6d3d1] text-center mt-4 text-sm">
          Already have an account?{" "}
          <span className="text-[#fbbf24] cursor-pointer font-bold hover:underline" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;