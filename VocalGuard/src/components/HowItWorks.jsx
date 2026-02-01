import {motion} from 'framer-motion';

export default function HowItWorks(){
    return(
    <motion.section initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.2 }}
     id="how" className=" border-b-4 border-gray-900 text-white py-16 px-4 ">
        <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF0080] via-[#FF8C00] to-[#FFD300] bg-clip-text text-transparent drop-shadow-[0_0_6px_#FF0080,0_0_15px_#FF8C00]">
            How It Works
        </h3>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-5xl mb-2">🎙️</div>
          <h4 className="text-xl font-semibold mb-2">Upload Audio</h4>
          <p>Upload or record a short voice sample.</p>
        </div>
        <div>
          <div className="text-5xl mb-2">🧠</div>
          <h4 className="text-xl font-semibold mb-2">Analyze</h4>
          <p>AI model detects patterns in pitch, noise, and frequency.</p>
        </div>
        <div>
          <div className="text-5xl mb-2">✅</div>
          <h4 className="text-xl font-semibold mb-2">Get Result</h4>
          <p>View whether the voice is real or synthetic with confidence score.</p>
        </div>
      </div>
    </motion.section>
    );
}