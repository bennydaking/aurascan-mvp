"use client";

import { CheckCircle2, AlertTriangle, ArrowRightCircle } from "lucide-react";
import Image from "next/image";

interface BiometricReportProps {
    imageUrl: string;
    data: {
        ratings: {
            symmetry: number;
            jawline: number;
            skin: number;
            overall: number;
        };
        flaws: string[];
        improvements: string[];
    };
    onReset: () => void;
}

export function BiometricReport({ imageUrl, data, onReset }: BiometricReportProps) {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Top Section - Image and Overall Score */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                    <Image src={imageUrl} alt="Analysis Target" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">Subject ID: #AX-892</div>
                        <div className="text-xs font-mono text-medical-blue uppercase">Status: Parsed</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CheckCircle2 className="w-24 h-24 text-medical-blue" />
                        </div>
                        <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-2">Aggregate Aesthetic Score</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-white">{data.ratings.overall}</span>
                            <span className="text-xl font-bold text-white/20">/ 10</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries({
                            "Facial Symmetry": data.ratings.symmetry,
                            "Mandibular Definition": data.ratings.jawline,
                            "Skin Texture Quality": data.ratings.skin
                        }).map(([label, score]) => (
                            <div key={label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{label}</span>
                                    <span className="text-sm font-bold text-medical-blue">{score.toFixed(1)}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-medical-blue shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000"
                                        style={{ width: `${score * 10}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Critical Findings Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Flaws / Deviations */}
                <div className="p-6 rounded-2xl border border-warning-red/20 bg-warning-red/5 space-y-4">
                    <div className="flex items-center gap-2 text-warning-red mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="text-xs font-mono uppercase tracking-wider font-bold">Structural Deviations</h4>
                    </div>
                    <ul className="space-y-3">
                        {data.flaws.map((flaw, i) => (
                            <li key={i} className="text-sm text-white/70 leading-relaxed font-sans border-l border-warning-red/30 pl-3">
                                {flaw}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Improvements / Optimization */}
                <div className="p-6 rounded-2xl border border-medical-blue/20 bg-medical-blue/5 space-y-4">
                    <div className="flex items-center gap-2 text-medical-blue mb-2">
                        <ArrowRightCircle className="w-4 h-4" />
                        <h4 className="text-xs font-mono uppercase tracking-wider font-bold">Bio-Optimization Pathway</h4>
                    </div>
                    <ul className="space-y-3">
                        {data.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-white/70 leading-relaxed font-sans border-l border-medical-blue/30 pl-3">
                                {improvement}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col items-center pt-8 border-t border-white/5">
                <button
                    onClick={onReset}
                    className="text-xs font-mono uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors"
                >
                    [ Re-initialize Scanner ]
                </button>
            </div>

        </div>
    );
}
