"use client";

import { CheckCircle2, AlertTriangle, ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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

                    {/* Tech Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(0, 255, 255, 0.4) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0, 255, 255, 0.4) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px',
                            backgroundPosition: 'center center'
                        }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%] border border-cyan-500/50 rounded-[40%] pointer-events-none shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/30 pointer-events-none" />
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/30 pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">Subject ID: #AX-892</div>
                        <div className="text-xs font-mono text-cyan-500 uppercase flex items-center gap-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_5px_#06b6d4]" />
                            Tracking Active
                        </div>
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

                    <div className="h-[250px] w-full p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                { subject: 'Symmetry', A: data.ratings.symmetry * 10, fullMark: 100 },
                                { subject: 'Jawline', A: data.ratings.jawline * 10, fullMark: 100 },
                                { subject: 'Skin', A: data.ratings.skin * 10, fullMark: 100 },
                                { subject: 'Eyes', A: Math.min((data.ratings.symmetry * 1.1) * 10, 100), fullMark: 100 },
                                { subject: 'Dimorphism', A: Math.min((data.ratings.overall * 1.05) * 10, 100), fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Biometrics"
                                    dataKey="A"
                                    stroke="#06b6d4"
                                    fill="#06b6d4"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Critical Findings Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Flaws / Deviations */}
                <div className="p-6 rounded-xl border border-warning-red/40 bg-black space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-warning-red/50 to-transparent" />
                    <div className="flex items-center gap-2 text-warning-red mb-2 border-b border-warning-red/20 pb-3">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold">Terminal Diagnostic: Deviations</h4>
                    </div>
                    <ul className="space-y-3 pt-2">
                        {data.flaws.map((flaw, i) => (
                            <li key={i} className="text-xs text-white/70 leading-relaxed font-mono pl-4 relative before:content-['>'] before:absolute before:left-0 before:text-warning-red/70 group hover:text-white transition-colors">
                                {flaw}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Improvements / Optimization */}
                <div className="p-6 rounded-xl border border-medical-blue/40 bg-black space-y-4 shadow-[0_0_20px_rgba(59,130,246,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-medical-blue/50 to-transparent" />
                    <div className="flex items-center gap-2 text-medical-blue mb-2 border-b border-medical-blue/20 pb-3">
                        <ArrowRightCircle className="w-4 h-4" />
                        <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold">Terminal Diagnostic: Optimization</h4>
                    </div>
                    <ul className="space-y-3 pt-2">
                        {data.improvements.map((improvement, i) => (
                            <li key={i} className="text-xs text-white/70 leading-relaxed font-mono pl-4 relative before:content-['>'] before:absolute before:left-0 before:text-medical-blue/70 group hover:text-white transition-colors">
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
