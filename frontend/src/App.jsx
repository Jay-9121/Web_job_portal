import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import EditUser from "./pages/EditUser";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
