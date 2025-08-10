import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AddWorkout from "../components/AddWorkout";
import WorkoutList from "../components/WorkoutList";
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const res = await API.get("/report/generate", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReport(res.data.report);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await API.get("/report/generate?download=true", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "fitness_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          {user ? (
            <>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome, <span className="text-blue-400">{user.name || "User"}</span> 🎉
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Add workout form */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6 border-gray-300 text-black placeholder-black">
          <AddWorkout onWorkoutAdded={() => setRefresh((prev) => !prev)} />
        </div>

        {/* Workout list */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <WorkoutList key={refresh} />
        </div>

        {/* Report Section */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">AI Fitness Report</h2>
          <div className="flex gap-3 mb-4">
            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
            {report && (
              <button
                onClick={downloadPDF}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Download PDF
              </button>
            )}
          </div>

          {report && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 prose prose-invert max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
