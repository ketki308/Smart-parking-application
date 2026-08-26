import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSlots, bookSlot } from "../services/api";

function SlotGrid() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ─────────────────────────────────────────
  // Load all slots on page load
  // ─────────────────────────────────────────
  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await getAllSlots();
      setSlots(response.data);
    } catch (err) {
      setError("Failed to load slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Book a slot
  // ─────────────────────────────────────────
  const handleBook = async (slotNumber) => {
    setMessage("");
    setError("");
    try {
      await bookSlot(slotNumber);
      setMessage(`Slot #${slotNumber} booked successfully!`);
      fetchSlots(); // Refresh slots after booking
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Try again.");
    }
  };

  // ─────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ─────────────────────────────────────────
  // Slot color based on status
  // ─────────────────────────────────────────
  const getSlotStyle = (status) => {
    const base = { ...styles.slot };
    if (status === "FREE") return { ...base, backgroundColor: "#22c55e", cursor: "pointer" };
    if (status === "OCCUPIED") return { ...base, backgroundColor: "#ef4444", cursor: "not-allowed" };
    if (status === "RESERVED") return { ...base, backgroundColor: "#f59e0b", cursor: "not-allowed" };
    return base;
  };

  const role = localStorage.getItem("role");

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🅿️ Smart Parking</h2>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate("/my-bookings")}>
            My Bookings
          </button>
          {role === "ADMIN" && (
            <button style={styles.navBtn} onClick={() => navigate("/admin")}>
              Admin
            </button>
          )}
          <button style={{ ...styles.navBtn, backgroundColor: "#ef4444" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <h3 style={styles.heading}>Parking Slots</h3>

        {/* Legend */}
        <div style={styles.legend}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#22c55e" }} /> Free
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#ef4444" }} /> Occupied
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#f59e0b" }} /> Reserved
          </span>
        </div>

        {/* Messages */}
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Slot Grid */}
        {loading ? (
          <p style={styles.loading}>Loading slots...</p>
        ) : (
          <div style={styles.grid}>
            {slots.map((slot) => (
              <div
                key={slot.id}
                style={getSlotStyle(slot.status)}
                onClick={() => slot.status === "FREE" && handleBook(slot.slotNumber)}
                title={slot.status === "FREE" ? "Click to book" : slot.status}
              >
                <div style={styles.slotNumber}>#{slot.slotNumber}</div>
                <div style={styles.slotStatus}>{slot.status}</div>
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
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "22px",
    color: "#1a1a2e",
    marginBottom: "16px",
  },
  legend: {
    display: "flex",
    gap: "24px",
    marginBottom: "24px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#555",
  },
  legendDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "16px",
  },
  slot: {
    padding: "20px 10px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transition: "transform 0.1s",
  },
  slotNumber: {
    fontSize: "20px",
    marginBottom: "6px",
  },
  slotStatus: {
    fontSize: "11px",
    opacity: 0.9,
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
    fontSize: "16px",
  },
};

export default SlotGrid;