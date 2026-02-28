"use client";

import { AlertCircle, Target, Sparkles, Activity } from "lucide-react";
import Image from "next/image";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface BiometricReportProps {
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
        optimizations: string[];
    };
    onReset: () => void;
}

export function BiometricReport({ imageUrl, data, onReset }: BiometricReportProps) {
    return (
        <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-8">
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">

                {/* LEFT: THE EVIDENCE (Photo & Mesh) */}
                <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/[0.05] bg-white/[0.01] shadow-2xl sticky top-8">
                    <Image src={imageUrl} alt="Analysis Target" fill className="object-cover opacity-90 filter grayscale" />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                    {/* Face Mesh Overlay Mock (White structural lines) */}
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 30,50 L 50,70 L 70,50 L 50,30 Z" fill="none" stroke="white" strokeWidth="0.5" className="animate-[pulse_3s_ease-in-out_infinite]" />
                        <path d="M 20,40 L 30,50 L 50,70 L 70,50 L 80,40" fill="none" stroke="white" strokeWidth="0.2" />
                        <path d="M 50,30 L 50,70" fill="none" stroke="white" strokeWidth="0.2" />
                        <circle cx="30" cy="50" r="1" fill="white" />
                        <circle cx="70" cy="50" r="1" fill="white" />
                        <circle cx="50" cy="70" r="1" fill="white" />
                        <circle cx="50" cy="30" r="1" fill="white" />
                    </svg>

                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-xs font-medium tracking-tight text-white">Subject Locked</span>
                    </div>
                </div>

                {/* RIGHT: THE VERDICT (Dashboard) */}
                <div className="space-y-6 flex flex-col h-full">

                    {/* Top Dashboard Row */}
                    <div className="grid sm:grid-cols-2 gap-6">

                        {/* Score Card */}
                        <div className="p-8 rounded-[2.5rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
                            <h3 className="text-sm font-medium tracking-tight text-white/50 mb-2">Overall Aesthetic Tier</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[5rem] leading-none font-medium tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-cyan-400 drop-shadow-sm">
                                    {data.overallScore}
                                </span>
                                <span className="text-2xl font-light text-white/30">/ 100</span>
                            </div>
                        </div>

                        {/* Radar Chart */}
                        <div className="p-6 rounded-[2.5rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl relative overflow-hidden h-[250px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_60%)] animate-pulse" />
                            <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                    { subject: 'Symmetry', A: data.metrics.symmetry, fullMark: 100 },
                                    { subject: 'Jawline', A: data.metrics.jawline, fullMark: 100 },
                                    { subject: 'Cheekbones', A: data.metrics.cheekbones, fullMark: 100 },
                                    { subject: 'Skin Quality', A: data.metrics.skin, fullMark: 100 },
                                    { subject: 'Eye Area', A: data.metrics.eyes, fullMark: 100 },
                                ]}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'sans-serif' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Biometrics" dataKey="A" stroke="#06b6d4" strokeWidth={1.5} fill="rgba(6,182,212,0.15)" fillOpacity={1} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lists Section */}
                    <div className="grid sm:grid-cols-2 gap-6 flex-1">

                        {/* Analysis (Flaws) */}
                        <div className="p-8 rounded-[2.5rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-6">
                                <AlertCircle className="w-5 h-5 text-white/70" />
                                <h4 className="text-xl font-medium tracking-tight text-white">Analysis</h4>
                            </div>
                            <ul className="space-y-4">
                                {data.deviations.map((flaw, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/60 text-sm font-light leading-relaxed group">
                                        <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/50 transition-colors" />
                                        <span>{flaw}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Protocol (Fixes) */}
                        <div className="p-8 rounded-[2.5rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-white/70" />
                                <h4 className="text-xl font-medium tracking-tight text-white">Protocol</h4>
                            </div>
                            <ul className="space-y-4">
                                {data.optimizations.map((optimization, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/60 text-sm font-light leading-relaxed group">
                                        <div className="text-xs font-medium text-white/30 group-hover:text-white/60 transition-colors pt-0.5">
                                            {String(i + 1).padStart(2, '0')}.
                                        </div>
                                        <span>{optimization}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={onReset}
                            className="text-sm tracking-tight text-white/30 hover:text-white transition-colors flex items-center gap-2"
                        >
                            Start New Scan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
