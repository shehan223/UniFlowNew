import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./navibar.css";

const NaviBar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hydrate = () => {
      const storedEmail = localStorage.getItem("email");
      setUsername(storedEmail || "");
    };

    hydrate();

    window.addEventListener("storage", hydrate);
    return () => {
      window.removeEventListener("storage", hydrate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src="https://res.cloudinary.com/da2wbtci0/image/upload/v1755955445/WhatsApp_Image_2025-08-19_at_11.58.41_PM_u2kgos.png"
          alt="Uniflow Logo"
          className="logo"
        />
      </div>

      <div className="navbar-right">
        <FaBell className="icon" />
        <div className="user-info">
          <FaUserCircle className="user-icon" style={{ height: "50px", width: "auto" }} />
          <span className="student-name">{username || "Authorized User"}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default NaviBar;
