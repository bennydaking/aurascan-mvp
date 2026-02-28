"use client";

import { Lock, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface ResultsPaywallProps {
    imageUrl: string;
    data: {
        overallScore: number;
        metrics: {
            symmetry: number;
            jawline: number;
            cheekbones: number;
            skin: number;
            eyes: number;
        };
        deviations: string[];
    };
    onUnlock: () => void;
}

export function ResultsPaywall({ imageUrl, data, onUnlock }: ResultsPaywallProps) {
    return (
        <div className="w-full max-w-2xl mx-auto relative overflow-hidden rounded-[2.5rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-3xl shadow-2xl mt-8 flex flex-col items-center">

            {/* Teaser Radar Chart Area */}
            <div className="relative w-full h-80 overflow-hidden flex items-center justify-center p-6 bg-gradient-to-b from-transparent to-black/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />

                {/* Clear Radar Chart */}
                <div className="w-full h-full max-w-sm relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                            { subject: 'Symmetry', A: data.metrics.symmetry, fullMark: 100 },
                            { subject: 'Jawline', A: data.metrics.jawline, fullMark: 100 },
                            { subject: 'Cheekbones', A: data.metrics.cheekbones, fullMark: 100 },
                            { subject: 'Skin Quality', A: data.metrics.skin, fullMark: 100 },
                            { subject: 'Eye Area', A: data.metrics.eyes, fullMark: 100 },
                        ]}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'sans-serif' }} />
                            <Radar name="User" dataKey="A" stroke="#06b6d4" strokeWidth={1} fill="rgba(6,182,212,0.15)" fillOpacity={1} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Blurred Overlay for Text */}
                <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-black via-transparent to-transparent z-20" />
            </div>

            {/* Paywall CLI-like Box */}
            <div className="w-full p-8 flex flex-col items-center justify-end relative z-30 -mt-12">
                <div className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-shimmer" />

                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs font-medium mb-6 animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {data.deviations.length} Structural Deviations Detected
                    </div>

                    <div className="text-3xl font-medium tracking-tight mb-2 text-white drop-shadow-sm">
                        Analysis Locked
                    </div>

                    <p className="text-base font-light text-white/50 mb-8 max-w-[280px] mx-auto leading-relaxed">
                        Geometric vector map generated. Unlock to reveal your granular score and optimization roadmap.
                    </p>

                    <button
                        onClick={onUnlock}
                        className="relative w-full group overflow-hidden bg-white text-black font-semibold py-4 px-6 rounded-xl transition-all hover:bg-white/90 focus:outline-none hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-black" />
                            Unlock Full Report ($2.99)
                        </span>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                    <div className="mt-4 text-[11px] font-sans tracking-tight text-white/30 flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" /> End-to-end encrypted
                    </div>
                </div>
            </div>
        </div>
    );
}
