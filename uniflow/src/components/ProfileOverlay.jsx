import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./profileOverlay.css";
import unknownAvatar from "../assets/unknown-avatar.svg";

const DEFAULT_AVATAR = unknownAvatar;

const YEAR_OPTIONS = ["First Year", "Second Year", "Third Year", "Fourth Year"];

const ROLE_KEYS = {
  student: {
    fields: [
      { key: "userFullName", label: "Full Name", type: "text" },
      { key: "userYear", label: "Year", type: "select", options: YEAR_OPTIONS },
      { key: "userID", label: "Student ID", type: "text" },
      { key: "userPhone", label: "Phone Number", type: "text" },
      { key: "userAddress", label: "Address", type: "textarea" },
    ],
    required: ["userProfilePhoto", "userFullName", "userYear", "userID", "userPhone", "userAddress"],
  },
  warden: {
    fields: [
      { key: "userFullName", label: "Full Name", type: "text" },
      { key: "wardAdminId", label: "Administrator ID", type: "text" },
      { key: "wardPhone", label: "Phone Number", type: "text" },
      { key: "wardEmail", label: "Primary Email", type: "text" },
    ],
    required: ["userFullName", "wardAdminId", "wardPhone", "wardEmail"],
  },
  doctor: {
    fields: [
      { key: "userFullName", label: "Full Name", type: "text" },
      { key: "docAdminId", label: "Administration ID", type: "text" },
      { key: "docPhone", label: "Phone Number", type: "text" },
      { key: "docEmail", label: "Primary Email", type: "text" },
    ],
    required: ["userFullName", "docAdminId", "docPhone", "docEmail"],
  },
};

const ALL_KEYS = Array.from(
  new Set(["userFullName", "userProfilePhoto"].concat(...Object.values(ROLE_KEYS).map((role) => role.fields.map((field) => field.key)))),
);

const DEFAULT_STATE = ALL_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {});

function readProfilePhoto() {
  try {
    return localStorage.getItem("userProfilePhoto") || "";
  } catch (error) {
    return "";
  }
}

const ProfileOverlay = ({ onClose, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [role, setRole] = useState("student");
  const [profileValues, setProfileValues] = useState(DEFAULT_STATE);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeToken, setShakeToken] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [privacyMessage, setPrivacyMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const storedRole =
      (localStorage.getItem("userRole") || localStorage.getItem("role") || "student").toLowerCase();
    setRole(["student", "warden", "doctor"].includes(storedRole) ? storedRole : "student");

    const nextValues = { ...DEFAULT_STATE };
    ALL_KEYS.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          nextValues[key] = value;
        }
      } catch (error) {
        // ignore read errors
      }
    });

    setProfileValues(nextValues);
    setProfilePhoto(readProfilePhoto());
    setFeedback({ type: "", text: "" });
    setFieldErrors({});
  }, []);

  useEffect(() => {
    if (activeTab !== "profile") {
      setFeedback({ type: "", text: "" });
      setFieldErrors({});
      setShakeToken((prev) => prev + 1);
    }
  }, [activeTab]);

  const trimmedName = useMemo(() => profileValues.userFullName.trim(), [profileValues.userFullName]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name.toLowerCase().includes("phone")) {
      const cleaned = value.replace(/[^\d+]/g, "");
      nextValue = cleaned.startsWith("+")
        ? `+${cleaned.slice(1).replace(/\+/g, "")}`.slice(0, 16)
        : cleaned.replace(/\+/g, "").slice(0, 15);
    }

    setProfileValues((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setFieldErrors((prev) => {
      if (!(name in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[name];
      return next;
    });

    setFeedback((prev) => (prev.type === "error" ? { type: "", text: "" } : prev));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFeedback({ type: "error", text: "Please upload a JPG, PNG, or WEBP image." });
      setFieldErrors((prev) => ({ ...prev, userProfilePhoto: "Please upload a supported image file." }));
      setShakeToken((prev) => prev + 1);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      try {
        localStorage.setItem("userProfilePhoto", result);
      } catch (error) {
        // ignore write failure
      }
      setProfilePhoto(result);
      setProfileValues((prev) => ({ ...prev, userProfilePhoto: result }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.userProfilePhoto;
        return next;
      });
      setFeedback({ type: "success", text: "Profile photo updated!" });
      onProfileUpdated?.({ profilePhoto: result });
    };
    reader.readAsDataURL(file);
  };

  const phonePatternStudent = /^07\d{8}$/;
  const phonePatternGeneral = /^(07\d{8}|0\d{9}|\+?\d{10,15})$/;
  const emailPattern = /^\S+@\S+\.\S+$/;

  const validateByRole = () => {
    const trimmedPhoto = profilePhoto?.trim();
    const trimmed = Object.fromEntries(
      Object.entries(profileValues).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]),
    );

    if (role === "doctor") {
      if (!trimmed.userFullName) {
        return { key: "userFullName", message: "Full name is required." };
      }
      if (!trimmed.docAdminId) {
        return { key: "docAdminId", message: "Administration ID is required." };
      }
      if (!phonePatternGeneral.test(trimmed.docPhone || "")) {
        return { key: "docPhone", message: "Enter a valid phone number." };
      }
      if (!emailPattern.test(trimmed.docEmail || "")) {
        return { key: "docEmail", message: "Enter a valid email." };
      }
      return null;
    }

    if (role === "warden") {
      if (!trimmed.userFullName) {
        return { key: "userFullName", message: "Full name is required." };
      }
      if (!trimmed.wardAdminId) {
        return { key: "wardAdminId", message: "Administrator ID is required." };
      }
      if (!phonePatternGeneral.test(trimmed.wardPhone || "")) {
        return { key: "wardPhone", message: "Enter a valid phone number." };
      }
      if (!emailPattern.test(trimmed.wardEmail || "")) {
        return { key: "wardEmail", message: "Enter a valid email." };
      }
      return null;
    }

    // student validation
    if (!trimmedPhoto) {
      return { key: "userProfilePhoto", message: "Profile photo is required." };
    }
    if (!trimmed.userFullName) {
      return { key: "userFullName", message: "Full name is required." };
    }
    if (!trimmed.userYear) {
      return { key: "userYear", message: "Year is required." };
    }
    if (!trimmed.userID) {
      return { key: "userID", message: "Student ID is required." };
    }
    if (!phonePatternStudent.test(trimmed.userPhone || "")) {
      return { key: "userPhone", message: "Enter a valid phone number." };
    }
    if (!trimmed.userAddress || trimmed.userAddress.length < 10) {
      return { key: "userAddress", message: "Please enter a complete address." };
    }
    return null;
  };

  const hasAllRequired = useMemo(() => {
    const roleConfig = ROLE_KEYS[role] || ROLE_KEYS.student;
    return roleConfig.required.every((key) => {
      if (key === "userProfilePhoto") {
        return String(profilePhoto || "").trim();
      }
      return String(profileValues[key] || "").trim();
    });
  }, [profilePhoto, profileValues, role]);

  const handleProfileSave = (event) => {
    event.preventDefault();
    const validationError = validateByRole();

    if (validationError) {
      setFieldErrors((prev) => ({
        ...prev,
        [validationError.key]: validationError.message,
      }));
      setFeedback({ type: "error", text: validationError.message });
      setShakeToken((prev) => prev + 1);
      return;
    }

    const cleaned = {};
    Object.keys(profileValues).forEach((key) => {
      const value = profileValues[key];
      cleaned[key] = typeof value === "string" ? value.trim() : value;
    });

    const payload = {
      ...cleaned,
      userFullName: trimmedName,
      userProfilePhoto: profilePhoto,
    };

    Object.entries(payload).forEach(([key, value]) => {
      try {
        if (value) {
          localStorage.setItem(key, value);
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // ignore write failure
      }
    });

    setProfileValues((prev) => ({
      ...prev,
      ...payload,
    }));

    onProfileUpdated?.({ fullName: trimmedName, profilePhoto });
    setFeedback({ type: "success", text: "Profile updated successfully!" });
  };

  const handlePasswordSave = (event) => {
    event.preventDefault();
    setPrivacyMessage({ type: "", text: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPrivacyMessage({ type: "error", text: "Please complete all fields." });
      return;
    }

    const storedPassword = localStorage.getItem("userPassword");
    if (!storedPassword || storedPassword !== currentPassword) {
      setPrivacyMessage({ type: "error", text: "Current password is incorrect." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPrivacyMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setPrivacyMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    localStorage.setItem("userPassword", newPassword);
    setPrivacyMessage({ type: "success", text: "Password successfully updated!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const roleConfig = ROLE_KEYS[role] || ROLE_KEYS.student;

  const renderField = ({ key, label, type, options }) => {
    const value = profileValues[key] || "";
    const error = fieldErrors[key];
    const baseClass = [
      "profile-form-field",
      error ? `profile-form-field--error profile-form-field--shake-${shakeToken}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const labelContent = (
      <span>
        {label}
        <span className="required-indicator">*</span>
      </span>
    );

    if (type === "select") {
      return (
        <label key={key} className={baseClass}>
          {labelContent}
          <select name={key} value={value} onChange={handleInputChange}>
            <option value="" disabled>
              Select {label.toLowerCase()}
            </option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && <p className="profile-form-field__error">{error}</p>}
        </label>
      );
    }

    if (type === "textarea") {
      return (
        <label key={key} className={baseClass}>
          {labelContent}
          <textarea
            name={key}
            value={value}
            onChange={handleInputChange}
            rows={3}
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
          {error && <p className="profile-form-field__error">{error}</p>}
        </label>
      );
    }

    return (
      <label key={key} className={baseClass}>
        {labelContent}
        <input
          type="text"
          name={key}
          value={value}
          onChange={handleInputChange}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        {error && <p className="profile-form-field__error">{error}</p>}
      </label>
    );
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="profile-card__close"
          aria-label="Close profile overlay"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="tab-bar">
          <button
            type="button"
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Settings
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy Settings
          </button>
        </div>

        <div className="profile-card__content">
          {activeTab === "profile" ? (
            <form className="profile-form" onSubmit={handleProfileSave} noValidate>
              <div
                className={[
                  "profile-photo-picker",
                  fieldErrors.userProfilePhoto ? `profile-photo-picker--error profile-photo-picker--shake-${shakeToken}` : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <label htmlFor="profile-photo-input">
                  <div className="profile-photo-preview">
                    <img
                      src={profilePhoto && profilePhoto.trim() ? profilePhoto : DEFAULT_AVATAR}
                      alt="Profile preview"
                    />
                  </div>
                  <span>Change Photo</span>
                  <input
                    id="profile-photo-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                  />
                </label>
                {fieldErrors.userProfilePhoto && (
                  <p className="profile-photo-picker__error">{fieldErrors.userProfilePhoto}</p>
                )}
              </div>

              <div className="profile-form-grid">{roleConfig.fields.map(renderField)}</div>

              {feedback.text && (
                <p className={`profile-feedback profile-feedback--${feedback.type}`}>{feedback.text}</p>
              )}

              <p className="profile-required-hint">
                All fields marked <span className="required-indicator">*</span> are required for your account.
              </p>

              <div className="profile-actions">
                <button type="submit" className="profile-save-btn" disabled={!hasAllRequired}>
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <form className="privacy-form" onSubmit={handlePasswordSave}>
              <label className="profile-form-field">
                <span>Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Enter current password"
                />
              </label>
              <label className="profile-form-field">
                <span>New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                />
              </label>
              <label className="profile-form-field">
                <span>Confirm New Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter new password"
                />
              </label>

              {privacyMessage.text && (
                <p className={`privacy-feedback privacy-feedback--${privacyMessage.type}`}>
                  {privacyMessage.text}
                </p>
              )}

              <div className="profile-actions">
                <button type="submit" className="profile-save-btn">
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

ProfileOverlay.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProfileUpdated: PropTypes.func,
};

ProfileOverlay.defaultProps = {
  onProfileUpdated: undefined,
};

export default ProfileOverlay;





