import matplotlib
matplotlib.use("Agg")  # <-- FIX: use non-GUI backend to prevent Tkinter errors

import os
import uuid
import numpy as np
import subprocess
import base64
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import librosa
import librosa.display
import tensorflow as tf
from flask_cors import CORS
import matplotlib.pyplot as plt

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MODEL_PATH = "tflite_learn_815023_3.tflite"

SAMPLE_RATE = 16000
TARGET_DURATION = 3.0
ALLOWED_EXT = {".wav", ".mp3", ".flac", ".ogg", ".m4a", ".webm"}
N_FEATURES = 26

app = Flask(__name__)
CORS(app)

print(f"Loading TFLite model: {MODEL_PATH}")
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
print("✅ Model Loaded")

DATA_MEAN = np.array([
    0.17, 0.11, 2074.22, 2604.15, 4748.39, 0.08,
    -130.81, 43.52, 36.90, 30.92, 25.88, 21.77,
    18.59, 15.7, 13.37, 11.44, 9.72, 8.30,
    7.03, 5.95, 5.02, 4.21, 3.52, 2.95,
    2.46, 2.04
], dtype=np.float32)

DATA_STD = np.array([
    0.10, 0.07, 600.2, 620.12, 1052.12, 0.05,
    10.63, 10.03, 9.77, 9.65, 9.49, 9.42,
    9.17, 9.01, 8.96, 8.75, 8.59, 8.45,
    8.21, 8.13, 8.02, 7.85, 7.74, 7.61,
    7.53, 7.45
], dtype=np.float32)

def convert_to_wav(path):
    try:
        ext = os.path.splitext(path)[1].lower()
        if ext == ".wav":
            return path
        out_path = path.rsplit(".", 1)[0] + ".wav"
        subprocess.run(["ffmpeg", "-y", "-i", path, "-ar", str(SAMPLE_RATE), "-ac", "1", out_path],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return out_path
    except Exception as e:
        print(f"Error converting audio to WAV: {e}")
        return path

def extract_features(y, sr):
    y = librosa.util.normalize(y)
    feat = [
        np.mean(librosa.feature.chroma_stft(y=y, sr=sr)),
        np.mean(librosa.feature.rms(y=y)),
        np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)),
        np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr)),
        np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)),
        np.mean(librosa.feature.zero_crossing_rate(y))
    ]
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    feat.extend(np.mean(mfccs, axis=1))
    return np.array(feat[:26], dtype=np.float32)

def create_spectrogram(y, sr, base_name):
    try:
        S = librosa.feature.melspectrogram(y=y, sr=sr)
        S_db = librosa.power_to_db(S, ref=np.max)
        img_path = os.path.join(UPLOAD_DIR, base_name + "_spec.png")
        plt.figure(figsize=(6, 4))
        librosa.display.specshow(S_db, sr=sr, x_axis="time", y_axis="mel")
        plt.colorbar(format="%+2.0f dB")
        plt.title("Mel Spectrogram")
        plt.tight_layout()
        plt.savefig(img_path)
        plt.close()
        return img_path
    except Exception as e:
        print(f"Error creating spectrogram: {e}")
        return ""

def preprocess(path, base_name):
    try:
        y, sr = librosa.load(path, sr=SAMPLE_RATE, mono=True)
        desired_len = int(SAMPLE_RATE * TARGET_DURATION)
        if len(y) < desired_len:
            y = np.pad(y, (0, desired_len - len(y)))
        else:
            y = y[:desired_len]
        spec_img = create_spectrogram(y, sr, base_name)
        features = extract_features(y, sr)
        X = (features - DATA_MEAN) / DATA_STD
        return X.reshape(1, N_FEATURES).astype(np.float32), spec_img
    except Exception as e:
        print(f"Error preprocessing audio: {e}")
        return np.zeros((1, N_FEATURES), dtype=np.float32), ""

def predict(X):
    try:
        interpreter.set_tensor(input_details[0]['index'], X)
        interpreter.invoke()
        probs = interpreter.get_tensor(output_details[0]['index'])[0]
        probs = np.exp(probs) / np.sum(np.exp(probs))
        idx = np.argmax(probs)
        return ("FAKE" if idx == 0 else "REAL"), float(np.max(probs)), probs.tolist()
    except Exception as e:
        print(f"Error predicting: {e}")
        return "UNKNOWN", 0.0, []

@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = secure_filename(file.filename)
    uid = uuid.uuid4().hex
    local_path = os.path.join(UPLOAD_DIR, uid + ".wav")
    file.save(local_path)

    wav_path = convert_to_wav(local_path)
    X, spectrogram_file = preprocess(wav_path, uid)
    label, conf, probs = predict(X)

    spectrogram_b64 = ""
    if spectrogram_file and os.path.exists(spectrogram_file):
        with open(spectrogram_file, "rb") as img:
            spectrogram_b64 = base64.b64encode(img.read()).decode("utf-8")

    return jsonify({
        "filename": filename,
        "label": label,
        "confidence": round(conf, 4),
        "probabilities": probs,
        "feature_count": N_FEATURES,
        "spectrogram": spectrogram_b64
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
