// src/components/TryDemo.jsx
import React, { useState } from "react";
import AudioUpload from "./AudioUpload";
import ResultCard from "./ResultCard";

export default function TryDemo() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function passed to AudioUpload for analyzing audio
  const handleAnalyze = async (file) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult({ ...data, filename: file.name });
    } catch (err) {
      console.error("Analysis failed:", err);
      setResult({ error: "Failed to analyze audio" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 text-white bg-gray-900 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8">Try The Demo</h2>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Audio upload & recording */}
        <AudioUpload onAnalyze={handleAnalyze} />

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        )}

        {/* Display prediction result */}
        {result && <ResultCard result={result} />}
      </div>
    </section>
  );
}
