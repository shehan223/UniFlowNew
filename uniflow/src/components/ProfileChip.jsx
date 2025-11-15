import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getDisplayName } from "../utils/getDisplayName";
import "./profileChip.css";
import unknownAvatar from "../assets/unknown-avatar.svg";

function readProfilePhoto() {
  try {
    return localStorage.getItem("userProfilePhoto") || "";
  } catch (error) {
    return "";
  }
}

const ProfileChip = ({
  displayName: displayNameProp,
  profilePhoto: profilePhotoProp,
  onClick,
  ariaLabel = "Open profile settings",
  ...buttonProps
}) => {
  const [displayName, setDisplayName] = useState(displayNameProp || getDisplayName());
  const [profilePhoto, setProfilePhoto] = useState(profilePhotoProp || readProfilePhoto());

  useEffect(() => {
    if (displayNameProp) {
      setDisplayName(displayNameProp);
    }
  }, [displayNameProp]);

  useEffect(() => {
    if (profilePhotoProp !== undefined) {
      setProfilePhoto(profilePhotoProp);
    }
  }, [profilePhotoProp]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "userFullName") {
        setDisplayName(getDisplayName());
      }
      if (event.key === "userProfilePhoto") {
        setProfilePhoto(readProfilePhoto());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const effectivePhoto =
    typeof profilePhoto === "string" && profilePhoto.trim().length > 0 ? profilePhoto : unknownAvatar;

  return (
    <button
      type="button"
      className="profile-chip"
      onClick={onClick}
      aria-label={ariaLabel}
      {...buttonProps}
    >
      <img src={effectivePhoto} alt="Profile" />
      <span>{displayName}</span>
    </button>
  );
};

ProfileChip.propTypes = {
  displayName: PropTypes.string,
  profilePhoto: PropTypes.string,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};

ProfileChip.defaultProps = {
  displayName: undefined,
  profilePhoto: undefined,
  onClick: undefined,
  ariaLabel: "Open profile settings",
};

export default ProfileChip;
