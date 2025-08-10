import { useEffect, useState } from "react";
import API from "../services/api";

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await API.get("/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(res.data);
      } catch (err) {
        console.error("Failed to fetch workouts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    try {
      await API.delete(`/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(workouts.filter((w) => w._id !== id));
    } catch (err) {
      console.error("Failed to delete workout", err);
    }
  };

  if (loading) return <p className="text-center">Loading workouts...</p>;
  if (workouts.length === 0) return <p className="text-center">No workouts yet.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-black font-bold mb-4">Your Workouts</h3>
      <ul className="space-y-3 text-gray-800">
        {workouts.map((w) => (
          <li
            key={w._id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-semibold">{w.type}</p>
              <p className="text-sm text-gray-500">
                {w.duration} min • {w.caloriesBurned} kcal •{" "}
                {new Date(w.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(w._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
