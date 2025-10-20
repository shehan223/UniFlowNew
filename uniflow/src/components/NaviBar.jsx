import React, { useEffect, useState } from 'react';
import { FaBell, FaUserCircle } from "react-icons/fa";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './navibar.css';

function NaviBar() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || user.email); // Fallback to email if name not set
    }
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="navbar">
      {/* Left Logo */}
      <div className="navbar-logo">
        <img
          src="https://res.cloudinary.com/da2wbtci0/image/upload/v1755955445/WhatsApp_Image_2025-08-19_at_11.58.41_PM_u2kgos.png"
          alt="Logo"
          style={{ height: '50px', width: 'auto' }}
        />
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        <FaBell className="icon" />
        <div className="user-info">
          <FaUserCircle className="user-icon" style={{ height: '50px', width: 'auto' }} />
          <span className="student-name">{username}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
}

export default NaviBar;
