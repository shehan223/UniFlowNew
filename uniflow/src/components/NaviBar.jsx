import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./navibar.css";
import { getDisplayName } from "../utils/getDisplayName";
import ProfileChip from "./ProfileChip";
import ProfileOverlay from "./ProfileOverlay";

const readProfilePhoto = () => {
  try {
    return localStorage.getItem("userProfilePhoto") || "";
  } catch (error) {
    return "";
  }
};

const NaviBar = () => {
  const [displayName, setDisplayName] = useState(() => getDisplayName());
  const [profilePhoto, setProfilePhoto] = useState(() => readProfilePhoto());
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hydrate = () => {
      setDisplayName(getDisplayName());
      setProfilePhoto(readProfilePhoto());
    };

    hydrate();

    window.addEventListener("storage", hydrate);
    return () => {
      window.removeEventListener("storage", hydrate);
    };
  }, []);

  const handleLogout = () => {
    const keysToClear = [
      "isAuthenticated",
      "email",
      "role",
      "userRole",
      "userFullName",
      "userProfilePhoto",
      "userPhone",
      "userAddress",
      "userYear",
      "userID",
      "userPassword",
      "userDepartment",
      "userRoleDescription",
      "wardenEmployeeId",
      "wardDept",
      "wardExt",
      "wardPhone",
      "wardAdminId",
      "wardEmail",
      "docRegNo",
      "docSpec",
      "docHours",
      "docPhone",
      "docAdminId",
      "docEmail",
    ];

    keysToClear.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        // ignore
      }
    });

    navigate("/login", { replace: true });
  };

  const handleProfileUpdated = (payload = {}) => {
    if (payload.fullName) {
      setDisplayName(getDisplayName());
    }
    if (Object.prototype.hasOwnProperty.call(payload, "profilePhoto")) {
      setProfilePhoto(payload.profilePhoto || readProfilePhoto());
    }
  };

  return (
    <>
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
          <ProfileChip
            displayName={displayName}
            profilePhoto={profilePhoto}
            onClick={() => setIsOverlayOpen(true)}
          />
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>
      {isOverlayOpen && (
        <ProfileOverlay
          onClose={() => setIsOverlayOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </>
  );
};

export default NaviBar;
