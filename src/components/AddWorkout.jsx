import { useState } from "react";
import { createWorkout } from "../services/api";

export default function AddWorkout({ onWorkoutAdded }) {
  const [form, setForm] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
    date: "",
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation (you can enhance)
    if (!form.type || !form.duration || !form.caloriesBurned) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await createWorkout(token, {
        type: form.type,
        duration: Number(form.duration),
        caloriesBurned: Number(form.caloriesBurned),
        date: form.date || new Date().toISOString(),
      });
      setForm({ type: "", duration: "", caloriesBurned: "", date: "" });
      if (onWorkoutAdded) onWorkoutAdded(); // callback to refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add workout");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md bg-white p-6 rounded shadow mb-6 mx-auto"
    >
      <h3 className="text-lg font-bold mb-4">Add New Workout</h3>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        name="type"
        placeholder="Workout Type (e.g., Running)"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
        required
      />

      <input
        type="number"
        name="duration"
        placeholder="Duration (minutes)"
        value={form.duration}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
        min="1"
        required
      />

      <input
        type="number"
        name="caloriesBurned"
        placeholder="Calories Burned"
        value={form.caloriesBurned}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
        min="1"
        required
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
      />

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Add Workout
      </button>
    </form>
  );
}
