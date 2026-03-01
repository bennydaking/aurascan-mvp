"use client";

import { Sparkles, Lock, ArrowUpRight, Activity } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface BiometricReportProps {
    imageUrl: string;
    data: {
        harmonyIndex: number;
        globalPercentile: string;
        structuralProfile: string;
        granularMetrics: {
            label: string;
            value: number;
            interpretation: string;
        }[];
        optimizationPotential: {
            current: number;
            projected: number;
            text: string;
        };
    };
    onReset: () => void;
}

export function BiometricReport({ imageUrl, data, onReset }: BiometricReportProps) {
    const handleDownload = () => {
        alert("Preparing high-fidelity clinical report... Your download will begin shortly.");
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-8 mb-40">

            {/* A. THE ANCHOR METRIC (Top Center) */}
            <div className="flex flex-col items-center text-center mb-20">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono mb-6">
                    Aesthetic Harmony Index
                </h3>
                <div className="relative">
                    <div className="absolute inset-0 blur-[60px] bg-cyan-500/20 rounded-full" />
                    <span className="relative text-[8rem] md:text-[10rem] leading-none font-medium tracking-tighter text-white drop-shadow-2xl">
                        {data.harmonyIndex.toFixed(1)}
                    </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm font-light mt-4 tracking-[0.2em] font-mono uppercase">
                    Global Population Percentile: <span className="text-white/80">{data.globalPercentile}</span>
                </p>
            </div>

            {/* B. THE STRUCTURAL PROFILE (Identity) */}
            <div className="w-full bg-white/[0.02] border-y border-white/10 py-12 px-6 mb-20 text-center backdrop-blur-3xl">
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono mb-4">
                    Structural Profile
                </h4>
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white uppercase drop-shadow-sm">
                    {data.structuralProfile}
                </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start px-4">

                {/* LEFT: THE EVIDENCE (Target Visualization) */}
                <div className="space-y-8">
                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 bg-black group">
                        <Image src={imageUrl} alt="Analysis Target" fill className="object-cover opacity-60 grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        {/* Biometric Overlay Mock */}
                        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 100 100">
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                d="M 30,40 L 50,20 L 70,40 L 50,60 Z"
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="0.5"
                            />
                            <circle cx="30" cy="40" r="1.5" fill="#06b6d4" />
                            <circle cx="70" cy="40" r="1.5" fill="#06b6d4" />
                            <circle cx="50" cy="20" r="1.5" fill="#06b6d4" />
                            <circle cx="50" cy="60" r="1.5" fill="#06b6d4" />
                        </svg>

                        <div className="absolute bottom-6 left-6 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Target Mapping: Active</span>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] backdrop-blur-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-4 h-4 text-white/30" />
                            <h5 className="text-sm font-medium text-white/60">Biometric Encryption</h5>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-light">
                            Numerical descriptors extracted. Facial geometry has been processed and securely purged from active server memory.
                        </p>
                    </div>
                </div>

                {/* RIGHT: THE GRANULAR METRICS (Grid) */}
                <div className="space-y-12">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
                        Granular Metrics (Deviation from Median)
                    </h3>

                    <div className="space-y-10">
                        {data.granularMetrics.map((metric, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                                            {metric.label}
                                        </div>
                                        <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest mt-1">
                                            {metric.interpretation}
                                        </div>
                                    </div>
                                    <div className="text-xl font-medium text-white font-mono">
                                        {metric.value}
                                        <span className="text-[10px] text-white/30 ml-1">
                                            {metric.label.includes('Angle') ? '°' : metric.label.includes('Index') || metric.label.includes('Ratio') ? '' : '%'}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-[2px] w-full bg-white/[0.05] relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metric.value}%` }}
                                        transition={{ duration: 1.5, delay: idx * 0.1 }}
                                        className="h-full bg-gradient-to-r from-cyan-400/50 to-cyan-400"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* D. THE UPSELL HOOK (Bottom) */}
                    <div className="relative mt-20 p-10 rounded-[2.5rem] border border-cyan-500/20 bg-cyan-950/10 overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1)_0%,transparent_70%)]" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-5 h-5 text-cyan-400" />
                                <h4 className="text-xl font-medium tracking-tight text-white uppercase">Optimization Potential: High</h4>
                            </div>

                            <p className="text-sm text-gray-400 leading-relaxed font-light mb-10">
                                {data.optimizationPotential.text}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Current</div>
                                    <div className="text-2xl font-medium text-white font-mono">{data.optimizationPotential.current}%</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <div className="text-[10px] text-cyan-400/50 uppercase tracking-widest mb-1">Projected Peak</div>
                                    <div className="text-2xl font-medium text-cyan-400 font-mono">{data.optimizationPotential.projected}%</div>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="w-full bg-white text-black font-semibold py-5 rounded-2xl transition-all hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group"
                            >
                                <Sparkles className="w-5 h-5" />
                                Unlock Optimization Roadmap ($3.99)
                                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-12">
                        <button
                            onClick={onReset}
                            className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/20 hover:text-white transition-colors"
                        >
                            Purge Records
                        </button>
                        <div className="text-[10px] font-mono text-white/10 italic">
                            Aurascan Protocol Alpha-7
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
