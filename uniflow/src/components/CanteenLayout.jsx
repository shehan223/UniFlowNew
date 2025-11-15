import React from "react";
import PropTypes from "prop-types";
import NaviBar from "./NaviBar";
import SideBar from "./SideBar";
import "./canteenLayout.css";

const defaultLinks = undefined;

const CanteenLayout = ({ children, activePath = "/canteen", sidebarLinks = defaultLinks }) => (
  <div className="canteen-page">
    <NaviBar />
    <div className="canteen-shell">
      <SideBar activePath={activePath} links={sidebarLinks || undefined} />
      <main className="canteen-content">{children}</main>
    </div>
  </div>
);

CanteenLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activePath: PropTypes.string,
  sidebarLinks: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      Icon: PropTypes.elementType.isRequired,
    }),
  ),
};

CanteenLayout.defaultProps = {
  activePath: "/canteen",
  sidebarLinks: undefined,
};

export default CanteenLayout;
