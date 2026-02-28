"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const scanSteps = [
    "Mapping facial proportions",
    "Measuring symmetry vectors",
    "Calculating aesthetic harmony",
    "Evaluating structural balance",
];

export function ScannerOverlay() {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % scanSteps.length);
            setProgress((prev) => {
                if (prev >= 92) return 36;
                return prev + 14;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/78 backdrop-blur-xl rounded-[3rem] overflow-hidden pointer-events-none p-6">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[260px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_72%)] pointer-events-none" />

            <div className="relative w-full max-w-[21rem] sm:max-w-[23rem] rounded-[2rem] border border-white/[0.08] bg-white/[0.025] px-6 sm:px-7 py-7 sm:py-8">
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/52 font-mono text-center mb-5 sm:mb-6">
                    Analyzing Structure
                </div>

                <div className="w-full h-[2px] rounded-full bg-white/[0.08] overflow-hidden mb-5 sm:mb-6">
                    <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="h-full rounded-full bg-cyan-300/75"
                    />
                </div>

                <div className="h-6 overflow-hidden flex items-center justify-center mb-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.4 }}
                            className="text-[12px] sm:text-[12.5px] font-medium tracking-[0.01em] text-white/78 text-center"
                        >
                            {scanSteps[activeStep]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="text-[11px] text-white/38 text-center tracking-[0.01em]">
                    This usually takes a few seconds.
                </div>
            </div>
        </div>
    );
}
