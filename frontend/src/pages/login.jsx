import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUserApi } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Invalid email address");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Sending data to backend
      const response = await loginUserApi(formData);

      if (response?.data?.success) {
        // Extract token and user data from response
        const { token, user } = response.data;

        // 1. Save credentials to LocalStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); 

        toast.success(response?.data?.message || "Login successful");

        // 2. ROLE-BASED REDIRECTION
        // This separates the Admin and User experiences immediately
        if (user.role === "admin") {
          toast.success(`Access Granted: Admin ${user.username}`);
          navigate("/admindashboard"); 
        } else {
          toast.success(`Welcome back, ${user.username}`);
          navigate("/dashboard");
        }
      } else {
        toast.error(response?.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error Details:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Server error. Try again later."
      );
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-linear-to-br from-[#3b2f2f] to-[#1f1b1b]">
      <form
        onSubmit={handleSubmit}
        className="w-90 p-8 rounded-2xl bg-[#2a2420] shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
      >
        <h2 className="text-[#f5f5f4] text-center mb-1 text-2xl font-bold">
          Login
        </h2>
        <p className="text-[#d6d3d1] text-center mb-6 text-sm">
          Enter your credentials
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-xl border border-[#7c6f64] bg-[#1f1b1b] text-[#f5f5f4] outline-hidden focus:ring-2 focus:ring-[#a16207] transition-all"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-xl border border-[#7c6f64] bg-[#1f1b1b] text-[#f5f5f4] outline-hidden focus:ring-2 focus:ring-[#a16207] transition-all"
        />

        <button
          type="submit"
          className="w-full p-3 rounded-xl bg-linear-to-r from-[#a16207] to-[#92400e] text-[#fafaf9] font-bold text-base cursor-pointer mt-2 hover:brightness-110 transition-all active:scale-95"
        >
          Login
        </button>

        <p className="text-[#d6d3d1] text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-[#fbbf24] cursor-pointer font-bold hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;