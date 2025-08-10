import axios from "axios";

const API_BASE = import.meta.env.PROD
  ? "https://your-backend.onrender.com"  // <-- your Render backend URL here
  : "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE + "/api",
});

// Automatically attach token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===== WORKOUT API FUNCTIONS =====
export const fetchWorkouts = () => API.get("/workouts");

export const createWorkout = (token, workoutData) => {
  return API.post("/workouts", workoutData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteWorkout = (id) =>
  API.delete(`/workouts/${id}`);

// Optional: Update workout if needed
export const updateWorkout = (id, workoutData) =>
  API.put(`/workouts/${id}`, workoutData);

// ===== AUTH API FUNCTIONS =====
export const requestOtpRegistration = (userData) => {
  // Sends name, email, password → sends OTP to email
  return API.post("/auth/register", userData);
};

export const verifyOtpRegistration = (email, otp) => {
  // Verifies OTP and completes registration
  return API.post("/auth/verify-otp", { email, otp });
};

// ===== LOGIN =====
export const loginUser = (formData) =>
  API.post("/auth/login", formData);



export default API;
