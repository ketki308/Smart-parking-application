import { Navigate } from "react-router-dom";

// ─────────────────────────────────────────
// ProtectedRoute — wraps pages that need
// authentication. Redirects to /login if
// no token found in localStorage.
// For adminOnly routes, checks role too.
// ─────────────────────────────────────────
function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in — redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Admin only page but user is not admin
  if (adminOnly && role !== "ADMIN") {
    return <Navigate to="/slots" />;
  }

  // All good — render the page
  return children;
}

export default ProtectedRoute;