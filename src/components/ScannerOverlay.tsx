"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const scanTerms = [
    "Mapping Jawline Vector...",
    "Measuring Inter-pupillary Distance...",
    "Analyzing Skin Texture...",
    "Calculating Sexual Dimorphism...",
    "Assessing Facial Harmony Index...",
    "Quantifying Canthal Tilt...",
    "Extracting Biometric Data...",
];

export function ScannerOverlay() {
    const [currentTermIndex, setCurrentTermIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTermIndex((prev) => (prev + 1) % scanTerms.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-xl overflow-hidden pointer-events-none">
            <div className="relative flex flex-col items-center max-w-sm w-full p-6 text-center border border-white/10 rounded-2xl bg-black/40 shadow-2xl">
                <Loader2 className="w-12 h-12 text-medical-blue animate-spin mb-6" />

                <div className="h-8 flex items-center justify-center w-full overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentTermIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="text-sm font-mono text-white/80 absolute"
                        >
                            {scanTerms[currentTermIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Clinical Grid aesthetic Background */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        zIndex: -1
                    }}
                />
            </div>
        </div>
    );
}
