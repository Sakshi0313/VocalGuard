import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Analytics() {
  const [history, setHistory] = useState([]);

  // Load analysis history from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("audioHistory")) || [];
    setHistory(stored);
  }, []);

  if (history.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        📭 No analysis history found.
        <br />
        Try analyzing some audio files first to view analytics.
      </div>
    );
  }

  // Compute label counts
  const labelCounts = history.reduce(
    (acc, item) => {
      acc[item.label] = (acc[item.label] || 0) + 1;
      return acc;
    },
    { REAL: 0, FAKE: 0 }
  );

  const total = history.length;
  const accuracy =
    total > 0 ? ((labelCounts.REAL / total) * 100).toFixed(1) : 0;

  const COLORS = ["#22c55e", "#ef4444"]; // Green = REAL, Red = FAKE

  const pieData = [
    { name: "REAL", value: labelCounts.REAL },
    { name: "FAKE", value: labelCounts.FAKE },
  ];


  // Clear history
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all analytics data?")) {
      localStorage.removeItem("analysisHistory");
      setHistory([]);
    }
  };

  // Download PDF report
function generatePDF(item) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("🎧 VocalGuard Audio Analysis", 14, 20);

  // Audio info
  doc.setFontSize(12);
  doc.text(`File: ${item.filename}`, 14, 30);
  doc.text(`Label: ${item.label}`, 14, 40);
  doc.text(`Confidence: ${(item.confidence * 100).toFixed(2)}%`, 14, 50);
  doc.text(`Date: ${item.date || "N/A"}`, 14, 60);

  // Check and add spectrogram
  if (item.spectrogram && item.spectrogram.length > 0) {
    try {
      doc.addImage(
        `data:image/png;base64,${item.spectrogram}`,
        "PNG",
        14,   // x position
        70,   // y position
        180,  // width
        100   // height
      );
    } catch (err) {
      console.error("Error adding spectrogram to PDF:", err);
      alert("Failed to add spectrogram to PDF. Check console for details.");
    }
  } else {
    console.warn("No spectrogram found for:", item.filename);
  }

  // Save PDF
  doc.save(`VocalGuard_${item.filename}.pdf`);
}

// Example: Generate PDF for the first entry only
if (history.length > 0) {
  generatePDF(history[0]);
} else {
  console.log("No history available to generate PDF.");
}


  return (
    <div className="max-w-6xl mx-auto mt-10 bg-gray-900 p-8 rounded-2xl shadow-xl text-white space-y-10">

      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-6">
        🎧 VocalGuard Analytics Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-sm text-gray-400">Total Analyses</h3>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-sm text-gray-400">Real Detections</h3>
          <p className="text-3xl font-bold text-green-400">
            {labelCounts.REAL}
          </p>
        </div>

        <div className="p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-sm text-gray-400">Fake Detections</h3>
          <p className="text-3xl font-bold text-red-400">
            {labelCounts.FAKE}
          </p>
        </div>

        <div className="p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-sm text-gray-400">Overall Accuracy</h3>
          <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-center">
          Label Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              labelLine={false}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>


      {/* History Table */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-center">
          📂 Previous Audio Analyses
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="p-3">File</th>
                <th className="p-3">Label</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Report</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="p-3">{item.filename}</td>
                  <td
                    className={`p-3 font-bold ${
                      item.label === "REAL" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {item.label}
                  </td>
                  <td className="p-3">
                    {(item.confidence * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    {item.date ? new Date(item.date).toLocaleString() : "N/A"}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => generatePDF(item)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      ⬇ PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear history button */}
      <div className="text-center">
        <button
          onClick={clearHistory}
          className="mt-4 px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-all"
        >
          🗑️ Clear All Analytics
        </button>
      </div>
    </div>
  );
}
