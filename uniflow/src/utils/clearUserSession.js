const AUTH_KEYS = [
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

const clearUserSession = () => {
  AUTH_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // ignore storage errors
    }
  });
};

export default clearUserSession;
