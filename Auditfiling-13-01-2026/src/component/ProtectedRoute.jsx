// import { Navigate } from "react-router-dom";

// export const ProtectedRoute = ({ children, role }) => {
//   const user = JSON.parse(sessionStorage.getItem("user"));

//   if (!user) return <Navigate to="/login" />;

//   if (role && user.role !== role) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// import { Navigate } from "react-router-dom";

// export const ProtectedRoute = ({ children, role }) => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   // ❌ Not logged in
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   // ❌ Role mismatch
//   if (role && user.role !== role) {
//     return <Navigate to="/" />;
//   }

//   // ✅ Access allowed
//   return children;
// };

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  // Get user from sessionStorage
  const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
  
  if (!userStr) {
    return <Navigate to="/userlogin" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    return <Navigate to="/userlogin" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = getRedirectPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

const getRedirectPath = (role) => {
  switch(role) {
    case "reseller": return "/reseller/dashboard";
    case "service_provider": return "/provider/dashboard";
    case "admin": return "/admin/dashboard";
    default: return "/user/dashboard";
  }
};