import { Typewriter } from "react-simple-typewriter";
import{motion } from "framer-motion";


export default function Hero() {
    return (
       <motion.section initial={{ opacity: 0, y: 40 }}
       whileInView={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, ease: 'easeOut' }}
       viewport={{ once: true }}
       className='text-center border-b-4 border-gray-900 text-white py-20 px-4'>
           <h1 className="text-4xl md:text-5xl font-bold mb-7 mt-5 text-center bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_5px_#f0f,0_0_10px_#0ff]">
                    <Typewriter
                        words={['Protect Yourself from Voice Deepfakes']}
                        loop={1}
                        cursor
                        cursorStyle="_"
                        typeSpeed={70}
                        deleteSpeed={2000}
                        delaySpeed={1000}
                    />
            </h1>

            <p className='text-lg md:text-xl mb-10 max-w-xl mx-auto'>
                VocalGuard uses advanced AI to detect and prevent voice deepfakes, ensuring your voice remains authentic and secure.
            </p>
            <a href="#try" className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:shadow-[0_0_15px_#3b82f6] transition-shadow duration-200">
                Try It Now
            </a>
       </motion.section>
    );
}