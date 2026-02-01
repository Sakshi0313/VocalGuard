import {motion} from 'framer-motion';
export default function Features() {
    return (
      <motion.section initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
       id="features" className="border-b-4 border-gray-900 text-white py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_5px_#9b59b6,0_0_10px_#8e44ad]">
            Key Features
        </h1>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 text-center">
          <div>
            <h4 className="text-xl font-semibold mb-2">🎯 Deepfake Detection</h4>
            <p>Accurately detects cloned voices using state-of-the-art AI.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">📊 Confidence Scores</h4>
            <p>Gives you a percentage breakdown of real vs. synthetic prediction.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">📁 Easy Upload</h4>
            <p>Supports voice recording or file upload in common formats.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">📈 Visual Insights</h4>
            <p>Displays spectrograms for audio forensic analysis.</p>
          </div>
        </div>
      </motion.section>
    );
  }
  