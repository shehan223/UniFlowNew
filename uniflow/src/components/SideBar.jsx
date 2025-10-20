import React from 'react'
import { FaTachometerAlt, FaQrcode, FaClipboardList, FaUtensils, FaClinicMedical, FaHome } from "react-icons/fa";
import './sidebar.css'
import { Link } from 'react-router-dom';


function SideBar() {
  return (
    <div className="sidebar">
      <Link to={'/'} style={{ textDecoration: "none", color: "black" }}>
      <button className="sidebar-btn">
        <FaTachometerAlt className="icon" />
        Dashboard
      </button>
      </Link>
      <Link to={'/qr'} style={{ textDecoration: "none", color: "black" }}>
      <button className="sidebar-btn">
        <FaQrcode className="icon" />
        QR Attendance
      </button>
      </Link>
      <button className="sidebar-btn">
        <FaClipboardList className="icon" />
        Notice Board
      </button>
      <button className="sidebar-btn">
        <FaUtensils className="icon" />
        Canteen
      </button>
      <button className="sidebar-btn">
        <FaClinicMedical className="icon" />
        Medical Center
      </button>
      <button className="sidebar-btn">
        <FaHome className="icon" />
        Hostel
      </button>
    </div>
  )
}

export default SideBar