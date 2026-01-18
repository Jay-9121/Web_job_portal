import { useState } from "react";
import toast from "react-hot-toast";
import { createUserApi } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }

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

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const dataToSubmit = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await createUserApi(dataToSubmit);

      if (response.data.success) {
        toast.success(response?.data?.message || "Registration successful");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
  // Show user-friendly toast
  toast.error(
    error.response?.data?.message || error.message || "Server error. Try again later."
  );

  // Log full error safely
  if (error.response) {
    // Server responded with a status code outside 2xx
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response received:", error.request);
  } else {
    // Something else triggered the error
    console.error("Error:", error.message);
  }}
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.subtitle}>Join us and get started</p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Register
        </button>
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
    background: "linear-gradient(135deg, #020617, #0f172a)"
  },
  form: {
    width: "360px",
    padding: "32px",
    borderRadius: "16px",
    background: "#020617",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
  },
  title: {
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: "6px",
    fontSize: "22px"
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: "22px",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none",
    transition: "border 0.2s ease"
  },
  button: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
    color: "#020617",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "6px"
  }
};

export default Register;
