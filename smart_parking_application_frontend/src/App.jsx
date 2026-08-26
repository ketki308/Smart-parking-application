import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SlotGrid from "./pages/SlotGrid";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes — no login needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — must be logged in */}
        <Route path="/slots" element={
          <ProtectedRoute>
            <SlotGrid />
          </ProtectedRoute>
        } />

        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Default — redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;