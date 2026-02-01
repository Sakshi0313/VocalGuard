import { useState, useEffect, useCallback, useRef } from "react";
import ResultCard from "./ResultCard";

export default function AudioUpload({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const objectUrlRef = useRef(null);

  // ---------- Analyze ----------
  const handleAnalyzeInternal = useCallback(
    async (inputFile) => {
      if (!inputFile) return;
      setLoading(true);
      setResult(null);

      try {
        if (onAnalyze) {
          await onAnalyze(inputFile);
        } else {
          const formData = new FormData();
          formData.append("file", inputFile);

          const res = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const text = await res.text().catch(() => null);
            throw new Error(text || "Server error");
          }

          const data = await res.json();
          setResult({ ...data, filename: inputFile.name || "Audio" });
        }
      } catch (err) {
        console.error("Analysis failed:", err);
        setResult({ error: "Failed to analyze file." });
      } finally {
        setLoading(false);
      }
    },
    [onAnalyze]
  );

  // ---------- Preview update ----------
  useEffect(() => {
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setAudioUrl(url);

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [file]);

  // ---------- Cleanup ----------
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  // ---------- File Select ----------
  const handleFileSelect = useCallback((e) => {
    const f = e.target?.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
    }
  }, []);

  // ---------- Recording ----------
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const recordedFile = new File([blob], "recorded-audio.wav", { type: "audio/wav" });
        setFile(recordedFile);
        setAudioUrl(URL.createObjectURL(recordedFile));
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setResult({ error: "Microphone access denied." });
    }
  }, []);

  const stopRecording = useCallback(() => {
    try {
      mediaRecorderRef.current?.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    } catch (err) {
      console.warn("Error stopping recording:", err);
    } finally {
      setRecording(false);
    }
  }, []);

  return (
    <div className="bg-black ring-1 ring-gray-700 p-6 rounded-lg space-y-4 text-white">
      <label
        htmlFor="upload-file"
        className="block w-full p-10 border-2 border-dashed border-blue-400 rounded cursor-pointer text-center hover:bg-gray-700 transition"
      >
        {file ? <span>{file.name}</span> : <span>Click to choose audio file</span>}
        <input id="upload-file" type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />
      </label>

      {audioUrl && <audio controls src={audioUrl} className="w-full rounded mt-2" />}

      <div className="flex justify-center gap-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            ⏹️ Stop Recording
          </button>
        )}
      </div>

      {file && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleAnalyzeInternal(file)}
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {loading ? "Analyzing..." : "🔍 Analyze"}
          </button>
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
