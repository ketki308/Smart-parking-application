import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/api";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    setMessage("");
    setError("");
    try {
      await cancelBooking(bookingId);
      setMessage("Booking cancelled successfully!");
      fetchBookings(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Cancel failed. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const getStatusStyle = (status) => {
    if (status === "ACTIVE") return { ...styles.badge, backgroundColor: "#22c55e" };
    if (status === "CANCELLED") return { ...styles.badge, backgroundColor: "#ef4444" };
    if (status === "COMPLETED") return { ...styles.badge, backgroundColor: "#6366f1" };
    return styles.badge;
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🅿️ Smart Parking</h2>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate("/slots")}>
            Slot Map
          </button>
          <button
            style={{ ...styles.navBtn, backgroundColor: "#ef4444" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <h3 style={styles.heading}>My Bookings</h3>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <p style={styles.loading}>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div style={styles.empty}>
            <p>You have no bookings yet.</p>
            <button style={styles.btn} onClick={() => navigate("/slots")}>
              Book a Slot
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.slotNum}>
                    Slot #{booking.slot?.slotNumber}
                  </div>
                  <div style={styles.meta}>
                    Booked at: {new Date(booking.bookedAt).toLocaleString()}
                  </div>
                  {booking.cancelledAt && (
                    <div style={styles.meta}>
                      Cancelled at: {new Date(booking.cancelledAt).toLocaleString()}
                    </div>
                  )}
                </div>
                <div style={styles.cardRight}>
                  <span style={getStatusStyle(booking.status)}>
                    {booking.status}
                  </span>
                  {booking.status === "ACTIVE" && (
                    <button
                      style={styles.cancelBtn}
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
  },
  navbar: {
    backgroundColor: "#1a1a2e",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: {
    color: "#fff",
    margin: 0,
    fontSize: "20px",
  },
  navLinks: {
    display: "flex",
    gap: "12px",
  },
  navBtn: {
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: {
    padding: "32px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "22px",
    color: "#1a1a2e",
    marginBottom: "24px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  cardRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },
  slotNum: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  meta: {
    fontSize: "13px",
    color: "#888",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: "6px 14px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  loading: {
    textAlign: "center",
    color: "#555",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: "60px",
  },
  btn: {
    marginTop: "12px",
    padding: "10px 24px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default MyBookings;