import React from "react";
import {
  FaTachometerAlt,
  FaQrcode,
  FaClipboardList,
  FaUtensils,
  FaClinicMedical,
  FaHome,
} from "react-icons/fa";
import "./sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { isCanteenAdmin } from "../canteenAuth";

const defaultLinks = [
  { to: "/dashboard", label: "Dashboard", Icon: FaTachometerAlt },
  { to: "/notices", label: "Notice Board", Icon: FaClipboardList },
  { to: "/qr", label: "QR Attendance", Icon: FaQrcode },
  { to: "/canteen", label: "Canteen", Icon: FaUtensils },
  { to: "/medical", label: "Medical Center", Icon: FaClinicMedical },
  { to: "/student", label: "Hostel", Icon: FaHome },
];

function SideBar({ links = defaultLinks, activePath }) {
  const { pathname } = useLocation();
  const currentPath = activePath ?? pathname;

  return (
    <div className="sidebar">
      {links.map(({ to, label, Icon }) => {
        const isCanteenLink = label === "Canteen";
        const destination = isCanteenLink
          ? isCanteenAdmin()
            ? "/canteen-admin"
            : "/canteen"
          : to;
        const isActive = isCanteenLink
          ? currentPath.startsWith("/canteen")
          : currentPath === destination;

        return (
          <Link
            key={`${label}-${destination}`}
            to={destination}
            style={{ textDecoration: "none", color: "black" }}
          >
            <button className={`sidebar-btn${isActive ? " active" : ""}`}>
              <Icon className="icon" />
              {label}
            </button>
          </Link>
        );
      })}
    </div>
  );
}

export default SideBar;
