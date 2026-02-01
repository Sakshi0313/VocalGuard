// src/components/ResultCard.jsx
import React, { useEffect } from "react";

export default function ResultCard({ result }) {
  // Save history when new result arrives
  useEffect(() => {
    if (result && !result.error) {
      const stored = JSON.parse(localStorage.getItem("audioHistory")) || [];

      const newEntry = {
        filename: result.filename || "Unknown",
        label: result.label,
        confidence: result.confidence,
        feature_count: result.feature_count,
        date: result.date || new Date().toLocaleString(), // ← now supports backend date
      };

      const updated = [newEntry, ...stored.slice(0, 9)];
      localStorage.setItem("audioHistory", JSON.stringify(updated));
    }
  }, [result]);

  if (!result) return null;

  const confidencePercent = (result.confidence * 100).toFixed(2);

  return (
    <div className="mt-6 p-5 border border-gray-700 bg-gray-900 rounded-lg shadow-lg max-w-4xl mx-auto text-white">
      <h2 className="text-xl font-semibold mb-4 text-center">
        🧠 VocalGuard: Analysis Result
      </h2>

      {result.error ? (
        <p className="text-red-500 font-medium text-center">{result.error}</p>
      ) : (
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          {/* LEFT SECTION - Details */}
          <div className="flex-1 space-y-3">
            <p>
              <strong>🎧 Filename:</strong> {result.filename || "Unknown"}
            </p>

            <p>
              <strong>🪄 Prediction:</strong>{" "}
              <span
                className={`${
                  result.label === "FAKE" ? "text-red-400" : "text-green-400"
                } font-semibold`}
              >
                {result.label}
              </span>
            </p>

            {/* Confidence bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">📊 Confidence</span>
                <span>{confidencePercent}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    result.label === "FAKE" ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${confidencePercent}%` }}
                ></div>
              </div>
            </div>

            <p>
              <strong>🧮 Feature Count:</strong> {result.feature_count}
            </p>

            <p>
              <strong>📅 Date:</strong> {result.date || "Not available"}
            </p>
          </div>

          {/* RIGHT SECTION - Spectrogram */}
          {result.spectrogram && (
            <div className="w-full md:w-1/3">
              <strong>📡 Spectrogram Insight:</strong>

              <img
                src={`data:image/png;base64,${result.spectrogram}`}
                alt="Spectrogram"
                className="mt-2 w-full rounded-lg border border-gray-600 shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
