# 🎤 VocalGuard - AI-Powered Voice Deepfake Detection


VocalGuard is an advanced AI-powered web application that detects voice deepfakes and synthetic audio with high accuracy. Using state-of-the-art machine learning models, it helps protect against voice cloning attacks and ensures audio authenticity.

## ✨ Features

- 🎯 **Deepfake Detection**: Accurately identifies cloned voices using advanced AI
- 📊 **Confidence Scores**: Provides percentage breakdown of real vs. synthetic predictions
- 📁 **Easy Upload**: Supports voice recording or file upload in multiple formats (WAV, MP3, FLAC, OGG, M4A, WebM)
- 📈 **Visual Insights**: Displays mel spectrograms for audio forensic analysis
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Real-time Processing**: Fast analysis with immediate results
- 📋 **Analytics Dashboard**: Track analysis history and statistics
- 🎨 **Modern UI**: Beautiful interface with particle animations and smooth transitions

## 🏗️ Architecture

VocalGuard consists of three main components:

1. **Frontend** (React + Vite): Modern web interface with real-time audio recording and file upload
2. **Backend Proxy** (Node.js + Express): Handles file uploads and proxies requests to ML API
3. **ML API** (Python + Flask): TensorFlow Lite model for deepfake detection with feature extraction

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│───▶│  Node.js Proxy  │───▶│   Python ML API │
│   (Port 5173)   │    │   (Port 3000)   │    │   (Port 5000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Multer** - File upload handling
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing

### ML API
- **Python 3.8+** - Programming language
- **Flask** - Lightweight web framework
- **TensorFlow Lite** - Optimized ML inference
- **Librosa** - Audio analysis library
- **NumPy** - Numerical computing
- **Matplotlib** - Plotting and visualization

## 📋 Prerequisites

Before running VocalGuard, ensure you have:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **FFmpeg** (for audio format conversion)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Sakshi0313/VocalGuard.git
cd VocalGuard
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Set Up Python ML API
```bash
cd ml_api
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

### 5. Start All Services

**Terminal 1 - ML API:**
```bash
cd ml_api
python app.py
```

**Terminal 2 - Backend Proxy:**
```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
VocalGuard/
├── src/                          # React frontend source
│   ├── components/               # React components
│   │   ├── AudioUpload.jsx      # File upload & recording
│   │   ├── ResultCard.jsx       # Analysis results display
│   │   ├── Analytics.jsx        # Statistics dashboard
│   │   └── ...
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── backend/                     # Node.js proxy server
│   ├── server.js               # Express server
│   ├── package.json            # Backend dependencies
│   └── uploads/                # Temporary file storage
├── ml_api/                     # Python ML API
│   ├── app.py                  # Flask application
│   ├── tflite_learn_815023_3.tflite  # TensorFlow Lite model
│   ├── scaler.pkl              # Feature scaler
│   ├── requirements.txt        # Python dependencies
│   └── uploads/                # Audio files & spectrograms
├── public/                     # Static assets
├── dist/                       # Production build
└── package.json               # Frontend dependencies
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000
REACT_APP_ML_API_URL=http://localhost:5000
```

### Model Configuration
The ML model uses the following parameters:
- **Sample Rate**: 16kHz
- **Duration**: 3 seconds
- **Features**: 26 MFCC and spectral features
- **Model**: TensorFlow Lite optimized for inference

## 🧪 How It Works

1. **Audio Input**: User uploads audio file or records voice
2. **Preprocessing**: Audio is converted to WAV, normalized, and padded/trimmed to 3 seconds
3. **Feature Extraction**: 26 features extracted including:
   - Chroma features
   - RMS energy
   - Spectral centroid, bandwidth, rolloff
   - Zero crossing rate
   - 20 MFCC coefficients
4. **Normalization**: Features are standardized using pre-computed mean and std
5. **Prediction**: TensorFlow Lite model classifies as REAL or FAKE
6. **Visualization**: Mel spectrogram generated for visual analysis

## 📊 Model Performance

The AI model achieves:
- **Accuracy**: ~90-99% on test datasets
- **Processing Time**: <2 seconds per audio file
- **Supported Formats**: WAV, MP3, FLAC, OGG, M4A, WebM
- **Model Size**: Optimized TensorFlow Lite model (~2MB)

## 🚀 Deployment

### GitHub Pages (Frontend Only)
```bash
npm run build
npm run deploy
```

### Full Stack Deployment
For production deployment, consider:
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, Railway, or DigitalOcean
- **ML API**: Google Cloud Run, AWS Lambda, or dedicated server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow team for the machine learning framework
- Librosa developers for audio processing capabilities
- React and Vite communities for excellent development tools
- Open source community for various libraries and tools used

---

⭐ If you found this project helpful, please give it a star on GitHub!
