import { useState } from "react";
import ParticleBackground from "./components/ParticleBackground";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import AudioUpload from "./components/AudioUpload";
import ResultCard from "./components/ResultCard";
import Analytics from "./components/Analytics";

function App() {
  const [results, setResults] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleAnalyze = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const newResult = {
        ...data,
        filename: file.name,
        date: new Date().toLocaleString(),
      };
      setResults((prev) => [...prev, newResult]);

      // ✅ store analysis history
      const history = JSON.parse(localStorage.getItem("analysisHistory")) || [];
      localStorage.setItem(
        "analysisHistory",
        JSON.stringify([newResult, ...history].slice(0, 20))
      );
    } catch (err) {
      console.error("Error:", err);
      setResults((prev) => [
        ...prev,
        { error: "Server error", filename: file.name },
      ]);
    }
  };

  // ✅ Toggle handler (moved into a separate function for clarity)
  const handleShowAnalytics = () => {
    setShowAnalytics((prev) => !prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative bg-black bg-opacity-70 text-white font-sans overflow-x-hidden min-h-screen">
      <ParticleBackground />
      <Toaster position="top-center" reverseOrder={false} />

      {/* ✅ Pass handler to Header */}
      <Header onShowAnalytics={handleShowAnalytics} />

      {/* Main Sections */}
      {!showAnalytics && (
        <>
          <Hero />
          <HowItWorks />
          <Features />

          {/* Try Demo Section */}
          <div id="try" className="p-8 space-y-8">
            <h1 className="text-3xl font-bold mb-4">🎤 Try the Demo</h1>
            <AudioUpload onAnalyze={handleAnalyze} />
          </div>

          {/* Results */}
          <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold mb-4">📊 Test Result Card</h1>
            {results.length === 0 ? (
              <p className="text-gray-400">
                No results yet. Upload or record audio to analyze.
              </p>
            ) : (
              results.map((res, idx) => <ResultCard key={idx} result={res} />)
            )}
          </div>
        </>
      )}

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="animate-fade-in">
          <Analytics />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
