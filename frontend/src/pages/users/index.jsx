import React, { useState } from "react";
import Nav from "../components/Nav";
import UserDashboard from "./UserDashboard";
import Bookings from "./Bookings";
import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";
import { useTheme } from "../../context/ThemeContext";

const UserPages = ({ user, onLogout }) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const renderContent = () => {
    switch (currentPage.toLowerCase()) {
      case "dashboard":
        return (
          <UserDashboard
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "applications":
        return (
          <Bookings
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "jobs":
        return (
          <Home
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "profile":
        return (
          <Profile
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "settings":
        return (
          <Settings
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      default:
        return (
          <UserDashboard
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark" ? "bg-slate-900" : "bg-slate-50"
      } transition-colors duration-300`}
    >
      {/* Sidebar Navigation */}
      <Nav
        activeTab={currentPage}
        setActiveTab={setCurrentPage}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full md:ml-64">{renderContent()}</main>
    </div>
  );
};

export default UserPages;
