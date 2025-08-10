// src/pages/Report.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Report() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // adjust if stored differently
      const res = await axios.get("/api/report/generate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data.report);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const token = localStorage.getItem("token");
    axios({
      url: "/api/report/generate?download=true",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "fitness_report.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to download PDF");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Generate Fitness Report</h1>
      <button onClick={generateReport} disabled={loading}>
        {loading ? "Generating..." : "Generate Report"}
      </button>

      {report && (
        <>
          <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
            <h2>Report:</h2>
            <p>{report}</p>
          </div>
          <button onClick={downloadPDF} style={{ marginTop: "10px" }}>
            Download as PDF
          </button>
        </>
      )}
    </div>
  );
}
