import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { isCanteenAdmin } from "../canteenAuth";

function PrivateCanteenAdminRoute({ children }) {
  if (!isCanteenAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

PrivateCanteenAdminRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PrivateCanteenAdminRoute;
