import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/login";
import EditUser from "./pages/EditUser";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<div>contact</div>} />
        <Route path="/contact" element={<div>admindash</div>} />
        <Route path="/contact" element={<div>userdash</div>} />
        <Route path="/EditUser/:id" element={<EditUser/>} />
        <Route path="/dashboard" element={<Dashboard/>} />

      </Routes>
    </Router>
  );
}

export default App