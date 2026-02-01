// backend/server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import path from "path";

const app = express();

// --- Config ---
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const FRONTEND_ORIGIN = "http://localhost:5173"; // adjust if your frontend URL changes
const PYTHON_API_URL = "http://localhost:8000/predict"; // Flask ML API endpoint
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(cors({
  origin: [FRONTEND_ORIGIN],
  methods: ["GET", "POST"],
}));

const upload = multer({ dest: uploadDir });

// --- Routes ---

/**
 * GET /health
 * Simple health check
 */
app.get("/health", (req, res) => res.json({ status: "ok" }));

/**
 * POST /analyze
 * Receives audio file, forwards to Python ML API, returns prediction.
 */
app.post("/analyze", upload.single("file"), async (req, res) => {
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    filePath = req.file.path;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    // Send file to Python ML API
    const response = await axios.post(PYTHON_API_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 15000, // 15 seconds
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error in /analyze:", error.message);

    if (error.response) {
      console.error("ML API response:", error.response.data);
      return res.status(error.response.status || 500).json({ error: error.response.data });
    }

    res.status(500).json({ error: "Error contacting ML API" });
  } finally {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

// --- Serve React build in production ---
const distPath = path.join(process.cwd(), "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Must be after API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Node backend running at http://localhost:${PORT}`);
});
