import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./navibar.css";
import { getDisplayName } from "../utils/getDisplayName";
import ProfileChip from "./ProfileChip";
import ProfileOverlay from "./ProfileOverlay";
import {
  getCanteenAuthUser,
  isCanteenAdmin,
  logoutCanteenAdmin,
} from "../canteenAuth";
import clearUserSession from "../utils/clearUserSession";

const readProfilePhoto = () => {
  try {
    return localStorage.getItem("userProfilePhoto") || "";
  } catch (error) {
    return "";
  }
};

const deriveDisplayName = () => {
  const adminUser = getCanteenAuthUser();
  if (adminUser?.displayName) {
    return adminUser.displayName;
  }
  return getDisplayName();
};

const NaviBar = () => {
  const [displayName, setDisplayName] = useState(() => deriveDisplayName());
  const [profilePhoto, setProfilePhoto] = useState(() => readProfilePhoto());
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayTab, setOverlayTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const hydrate = () => {
      setDisplayName(deriveDisplayName());
      setProfilePhoto(readProfilePhoto());
    };

    hydrate();

    window.addEventListener("storage", hydrate);
    return () => {
      window.removeEventListener("storage", hydrate);
    };
  }, []);

  const handleLogout = () => {
    logoutCanteenAdmin();
    clearUserSession();
    window.dispatchEvent(new Event("storage"));
    navigate("/login", { replace: true });
  };

  const handleProfileUpdated = (payload = {}) => {
    if (payload.fullName) {
      setDisplayName(deriveDisplayName());
    }
    if (Object.prototype.hasOwnProperty.call(payload, "profilePhoto")) {
      setProfilePhoto(payload.profilePhoto || readProfilePhoto());
    }
  };

  const openOverlay = (tab = "profile") => {
    setOverlayTab(tab);
    setIsOverlayOpen(true);
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
          <div className="navbar-profile">
            <ProfileChip
              displayName={displayName}
              profilePhoto={profilePhoto}
              onClick={() => openOverlay("profile")}
              ariaLabel="Open profile settings"
            />
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>
      {isOverlayOpen && (
        <ProfileOverlay
          initialTab={overlayTab}
          onClose={() => setIsOverlayOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </>
  );
};

export default NaviBar;
