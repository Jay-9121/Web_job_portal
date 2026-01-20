import { useState } from "react";
import { useNavigate } from "react-router-dom"; // navigation hook
import toast from "react-hot-toast";
import { loginUserApi } from "../services/api"; // your login API call

const Login = () => {
  const navigate = useNavigate(); // navigation
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      const response = await loginUserApi({
        email: formData.email,
        password: formData.password
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Login successful");

        // Save token in localStorage or context
        localStorage.setItem("token", response.data.token);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        toast.error(response?.data?.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Server error. Try again later."
      );
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>Enter your credentials</p>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p style={styles.switchText}>
          Don’t have an account?{" "}
          <span
            style={styles.switchLink}
            onClick={() => navigate("/register")} // go to register
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #3b2f2f, #1f1b1b)"
  },
  form: {
    width: "360px",
    padding: "32px",
    borderRadius: "16px",
    background: "#2a2420",
    boxShadow: "0 18px 40px rgba(0,0,0,0.6)"
  },
  title: {
    color: "#f5f5f4",
    textAlign: "center",
    marginBottom: "6px",
    fontSize: "22px"
  },
  subtitle: {
    color: "#d6d3d1",
    textAlign: "center",
    marginBottom: "22px",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #7c6f64",
    background: "#1f1b1b",
    color: "#f5f5f4",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #a16207, #92400e)",
    color: "#fafaf9",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "6px"
  },
  switchText: {
    color: "#d6d3d1",
    textAlign: "center",
    marginTop: "12px",
    fontSize: "14px"
  },
  switchLink: {
    color: "#fbbf24",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Login;
