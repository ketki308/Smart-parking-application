import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSlots, getAllBookings } from "../services/api";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("slots");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newSlotNumber, setNewSlotNumber] = useState("");
  const [staleHours, setStaleHours] = useState(2);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        getAllSlots(),
        getAllBookings(),
      ]);
      setSlots(slotsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setError("");
    setTimeout(() => setMessage(""), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setMessage("");
    setTimeout(() => setError(""), 3000);
  };

  // ─────────────────────────────────────────
  // Feature 1 — Change slot status
  // ─────────────────────────────────────────
  const handleStatusChange = async (slotNumber, status) => {
    try {
      await api.put(`/admin/slots/${slotNumber}/status?status=${status}`);
      showMessage(`Slot #${slotNumber} updated to ${status}`);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update slot status");
    }
  };

  // ─────────────────────────────────────────
  // Feature 2 — Cancel stale bookings
  // ─────────────────────────────────────────
  const handleCancelStale = async () => {
    try {
      const res = await api.put(`/admin/bookings/cancel-stale?hours=${staleHours}`);
      showMessage(res.data);
      fetchData();
    } catch (err) {
      showError("Failed to cancel stale bookings");
    }
  };

  // ─────────────────────────────────────────
  // Feature 3 — Add a new slot
  // ─────────────────────────────────────────
  const handleAddSlot = async () => {
    if (!newSlotNumber) return;
    try {
      await api.post(`/admin/slots?slotNumber=${newSlotNumber}`);
      showMessage(`Slot #${newSlotNumber} added successfully!`);
      setNewSlotNumber("");
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to add slot");
    }
  };

  // ─────────────────────────────────────────
  // Feature 4 — Delete a slot
  // ─────────────────────────────────────────
  const handleDeleteSlot = async (slotNumber) => {
    if (!window.confirm(`Delete Slot #${slotNumber}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/slots/${slotNumber}`);
      showMessage(`Slot #${slotNumber} deleted successfully`);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete slot");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Stats
  const freeCount = slots.filter((s) => s.status === "FREE").length;
  const occupiedCount = slots.filter((s) => s.status === "OCCUPIED").length;
  const reservedCount = slots.filter((s) => s.status === "RESERVED").length;
  const activeBookings = bookings.filter((b) => b.status === "ACTIVE").length;
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED").length;

  const getBookingBadge = (status) => {
    if (status === "ACTIVE") return { ...styles.badge, backgroundColor: "#22c55e" };
    if (status === "CANCELLED") return { ...styles.badge, backgroundColor: "#ef4444" };
    if (status === "COMPLETED") return { ...styles.badge, backgroundColor: "#6366f1" };
    return styles.badge;
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🅿️ Smart Parking — Admin</h2>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate("/slots")}>
            Slot Map
          </button>
          <button style={{ ...styles.navBtn, backgroundColor: "#ef4444" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>

        {/* Messages */}
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderTop: "4px solid #22c55e" }}>
            <div style={styles.statNumber}>{freeCount}</div>
            <div style={styles.statLabel}>Free Slots</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: "4px solid #ef4444" }}>
            <div style={styles.statNumber}>{occupiedCount}</div>
            <div style={styles.statLabel}>Occupied</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: "4px solid #f59e0b" }}>
            <div style={styles.statNumber}>{reservedCount}</div>
            <div style={styles.statLabel}>Reserved</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: "4px solid #6366f1" }}>
            <div style={styles.statNumber}>{activeBookings}</div>
            <div style={styles.statLabel}>Active Bookings</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: "4px solid #94a3b8" }}>
            <div style={styles.statNumber}>{cancelledBookings}</div>
            <div style={styles.statLabel}>Cancelled</div>
          </div>
        </div>

        {/* Admin Actions Bar */}
        <div style={styles.actionsBar}>

          {/* Add Slot */}
          <div style={styles.actionGroup}>
            <span style={styles.actionLabel}>Add New Slot:</span>
            <input
              style={styles.input}
              type="number"
              placeholder="Slot number"
              value={newSlotNumber}
              onChange={(e) => setNewSlotNumber(e.target.value)}
            />
            <button style={styles.greenBtn} onClick={handleAddSlot}>
              + Add Slot
            </button>
          </div>

          {/* Cancel Stale Bookings */}
          <div style={styles.actionGroup}>
            <span style={styles.actionLabel}>Cancel stale bookings older than:</span>
            <input
              style={{ ...styles.input, width: "60px" }}
              type="number"
              value={staleHours}
              onChange={(e) => setStaleHours(e.target.value)}
              min="1"
            />
            <span style={styles.actionLabel}>hours</span>
            <button style={styles.orangeBtn} onClick={handleCancelStale}>
              Cancel Stale
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === "slots" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("slots")}
          >
            All Slots
          </button>
          <button
            style={activeTab === "bookings" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("bookings")}
          >
            All Bookings
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : activeTab === "slots" ? (

          // ── Slots Table ──
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Slot #</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Last Updated</th>
                <th style={styles.th}>Change Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} style={styles.tr}>
                  <td style={styles.td}>#{slot.slotNumber}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor:
                        slot.status === "FREE" ? "#22c55e" :
                        slot.status === "OCCUPIED" ? "#ef4444" : "#f59e0b"
                    }}>
                      {slot.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {slot.lastUpdated
                      ? new Date(slot.lastUpdated).toLocaleString()
                      : "—"}
                  </td>
                  <td style={styles.td}>
                    {/* Status dropdown */}
                    <select
                      style={styles.select}
                      value={slot.status}
                      onChange={(e) => handleStatusChange(slot.slotNumber, e.target.value)}
                    >
                      <option value="FREE">FREE</option>
                      <option value="OCCUPIED">OCCUPIED</option>
                      <option value="RESERVED">RESERVED</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteSlot(slot.slotNumber)}
                      disabled={slot.status !== "FREE"}
                      title={slot.status !== "FREE" ? "Only FREE slots can be deleted" : "Delete slot"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : (

          // ── Bookings Table ──
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Slot #</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Booked At</th>
                <th style={styles.th}>Cancelled At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} style={styles.tr}>
                  <td style={styles.td}>#{booking.id}</td>
                  <td style={styles.td}>{booking.user?.username}</td>
                  <td style={styles.td}>#{booking.slot?.slotNumber}</td>
                  <td style={styles.td}>
                    <span style={getBookingBadge(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(booking.bookedAt).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    {booking.cancelledAt
                      ? new Date(booking.cancelledAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f0f2f5" },
  navbar: {
    backgroundColor: "#1a1a2e",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: { color: "#fff", margin: 0, fontSize: "20px" },
  navLinks: { display: "flex", gap: "12px" },
  navBtn: {
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  statNumber: { fontSize: "36px", fontWeight: "bold", color: "#1a1a2e" },
  statLabel: { fontSize: "13px", color: "#888", marginTop: "4px" },
  actionsBar: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "24px",
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    alignItems: "center",
  },
  actionGroup: { display: "flex", alignItems: "center", gap: "10px" },
  actionLabel: { fontSize: "14px", color: "#333", fontWeight: "bold" },
  input: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "120px",
  },
  greenBtn: {
    padding: "8px 16px",
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  orangeBtn: {
    padding: "8px 16px",
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: {
    padding: "10px 24px",
    backgroundColor: "#e2e8f0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555",
  },
  tabActive: {
    padding: "10px 24px",
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#fff",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  thead: { backgroundColor: "#1a1a2e" },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "bold",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 16px", fontSize: "14px", color: "#333" },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "13px",
    cursor: "pointer",
  },
  deleteBtn: {
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
  loading: { textAlign: "center", color: "#555" },
};

export default AdminDashboard;