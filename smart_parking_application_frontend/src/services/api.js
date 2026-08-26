import axios from "axios";

// ─────────────────────────────────────────
// Base URL — your Spring Boot backend
// ─────────────────────────────────────────
const BASE_URL = "http://localhost:8080/api";

// ─────────────────────────────────────────
// Axios instance — automatically adds
// JWT token to every request
// ─────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─────────────────────────────────────────
// Auth APIs
// ─────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// ─────────────────────────────────────────
// Slot APIs
// ─────────────────────────────────────────
export const getAllSlots = () => api.get("/slots");
export const getFreeSlots = () => api.get("/slots/free");
export const getSlotByNumber = (slotNumber) => api.get(`/slots/${slotNumber}`);
export const getSlotCount = (status) => api.get(`/slots/count/${status}`);

// ─────────────────────────────────────────
// Booking APIs
// ─────────────────────────────────────────
export const bookSlot = (slotNumber) => api.post(`/bookings/${slotNumber}`);
export const cancelBooking = (bookingId) => api.put(`/bookings/${bookingId}/cancel`);
export const getMyBookings = () => api.get("/bookings/my");
export const getMyActiveBookings = () => api.get("/bookings/my/active");

// ─────────────────────────────────────────
// Admin — Booking APIs
// ─────────────────────────────────────────
export const getAllBookings = () => api.get("/bookings");
export const getBookingsByStatus = (status) => api.get(`/bookings/status/${status}`);

// ─────────────────────────────────────────
// Admin — Slot Management APIs
// ─────────────────────────────────────────
export const adminUpdateSlotStatus = (slotNumber, status) =>
  api.put(`/admin/slots/${slotNumber}/status?status=${status}`);

export const adminAddSlot = (slotNumber) =>
  api.post(`/admin/slots?slotNumber=${slotNumber}`);

export const adminDeleteSlot = (slotNumber) =>
  api.delete(`/admin/slots/${slotNumber}`);

export const adminCancelStaleBookings = (hours) =>
  api.put(`/admin/bookings/cancel-stale?hours=${hours}`);

export default api;