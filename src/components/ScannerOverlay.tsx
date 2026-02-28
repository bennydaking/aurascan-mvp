"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const scanSteps = [
    { text: "Initializing Vision Engine", delay: 0 },
    { text: "Mapping facial topography", delay: 1000 },
    { text: "Calculating canthal tilt vectors", delay: 2000 },
    { text: "Evaluating skin texture & lipid flow", delay: 3200 },
    { text: "Computing structural symmetry", delay: 4500 },
    { text: "Finalizing Biometric Verdict", delay: 5800 },
];

export function ScannerOverlay() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timers = scanSteps.map((step, index) => {
            return setTimeout(() => {
                setActiveStep(index);
            }, step.delay);
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden pointer-events-none">
            <div className="relative flex flex-col items-center max-w-sm w-full p-8 p-12 text-center rounded-3xl bg-white/[0.01] border border-white/[0.05] shadow-2xl">

                {/* Glowing Scanner Line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                    <Loader2 className="relative w-10 h-10 text-white animate-spin" />
                </div>

                <div className="w-full flex justify-center h-[120px]">
                    <div className="flex flex-col items-start gap-4">
                        {scanSteps.map((step, index) => {
                            const isPast = index < activeStep;
                            const isCurrent = index === activeStep;
                            const isFuture = index > activeStep;

                            if (isFuture && index > activeStep + 1) return null; // Show only up to one future step

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                        opacity: isFuture ? 0 : 1,
                                        x: 0,
                                        color: isPast ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)'
                                    }}
                                    className="flex items-center gap-3 text-sm font-light tracking-tight transition-colors duration-500"
                                >
                                    <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                                        {isPast && <div className="w-2 h-2 rounded-full bg-white" />}
                                        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />}
                                    </div>
                                    <span>{step.text}</span>
                                    {isPast && <span className="text-[10px] uppercase font-mono tracking-widest ml-2 text-white/30">[OK]</span>}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
