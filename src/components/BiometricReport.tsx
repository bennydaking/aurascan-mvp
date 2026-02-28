"use client";

import { CheckCircle2, AlertTriangle, ArrowUpRight, Hexagon, Activity, Target } from "lucide-react";
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
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-cyan-500/30 bg-black shadow-[0_0_40px_rgba(6,182,212,0.15)] group group-hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all duration-700">
                    <Image src={imageUrl} alt="Analysis Target" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Active HUD Targeting */}
                    {/* Face Mesh pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.2) 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }}
                    />

                    {/* Reticles */}
                    <div className="absolute top-[35%] left-[25%] w-12 h-12 border-l border-t border-cyan-400/80 pointer-events-none animate-pulse" />
                    <div className="absolute top-[35%] right-[25%] w-12 h-12 border-r border-t border-cyan-400/80 pointer-events-none animate-pulse" />
                    <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-16 h-8 border-b border-l border-r border-cyan-400/60 pointer-events-none" />

                    {/* Scanner Line */}
                    <div className="absolute left-0 w-full h-[2px] bg-cyan-400/50 pointer-events-none animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ top: '50%' }} />

                    {/* Data Stream */}
                    <div className="absolute top-4 right-4 text-[7px] font-mono text-cyan-400/60 text-right uppercase tracking-widest hidden sm:block pointer-events-none">
                        <div className="leading-snug">0x9F43.A :: MAPPING<br />0x1A2B.C :: SYMMETRY<br />0x8C11.X :: ORBITAL<br />0x4F99.T :: VECTOR<br />0x9F43.A :: MAPPING</div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
                            <span className="animate-pulse">BIOMETRIC LOCK ESTABLISHED</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 flex flex-col h-full">
                    <div className="p-6 rounded-2xl border border-cyan-500/20 bg-black backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Target className="w-32 h-32 text-cyan-400 animate-[spin_10s_linear_infinite]" />
                        </div>
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400/60 mb-2">Subject Index Query</h3>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <span className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{data.ratings.overall}</span>
                            <span className="text-xl font-bold text-white/30">/ 10</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px] p-4 rounded-xl border border-cyan-500/10 bg-black relative overflow-hidden group">
                        {/* Holographic Radar Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_60%)] animate-pulse" />

                        <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                { subject: 'Symmetry', A: data.ratings.symmetry * 10, fullMark: 100 },
                                { subject: 'Jawline', A: data.ratings.jawline * 10, fullMark: 100 },
                                { subject: 'Skin', A: data.ratings.skin * 10, fullMark: 100 },
                                { subject: 'Eyes', A: Math.min((data.ratings.symmetry * 1.1) * 10, 100), fullMark: 100 },
                                { subject: 'Dimorphism', A: Math.min((data.ratings.overall * 1.05) * 10, 100), fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="rgba(6,182,212,0.15)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(6,182,212,0.9)', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Biometrics"
                                    dataKey="A"
                                    stroke="#00ffff"
                                    strokeWidth={2}
                                    fill="url(#hologram)"
                                    fillOpacity={0.7}
                                />
                                <defs>
                                    <radialGradient id="hologram" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#00ffff" stopOpacity={0.2} />
                                    </radialGradient>
                                </defs>
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Critical Findings Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Flaws / Deviations */}
                <div className="p-6 rounded-xl border border-red-500/40 bg-black/60 backdrop-blur-xl space-y-5 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden group hover:border-red-500/60 transition-colors">
                    {/* Scanline pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-transparent opacity-80" />

                    <div className="flex items-center gap-3 text-red-500 mb-2 border-b border-red-500/20 pb-4 relative z-10">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                        <h4 className="text-lg font-mono uppercase tracking-widest font-black drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">Deviations</h4>
                    </div>
                    <ul className="space-y-4 pt-2 relative z-10">
                        {data.flaws.map((flaw, i) => (
                            <li key={i} className="text-sm text-red-100/90 leading-relaxed font-mono flex items-start gap-3 group-hover:text-white transition-colors">
                                <Hexagon className="w-4 h-4 text-red-500/70 mt-1 flex-shrink-0" />
                                <span>{flaw}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Improvements / Optimization */}
                <div className="p-6 rounded-xl border border-cyan-500/40 bg-black/60 backdrop-blur-xl space-y-5 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden group hover:border-cyan-500/60 transition-colors">
                    {/* Scanline pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-transparent opacity-80" />

                    <div className="flex items-center gap-3 text-cyan-400 mb-2 border-b border-cyan-500/20 pb-4 relative z-10">
                        <ArrowUpRight className="w-6 h-6" />
                        <h4 className="text-lg font-mono uppercase tracking-widest font-black drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Optimization</h4>
                    </div>
                    <ul className="space-y-4 pt-2 relative z-10">
                        {data.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-cyan-100/90 leading-relaxed font-mono flex items-start gap-3 group-hover:text-white transition-colors">
                                <Activity className="w-4 h-4 text-cyan-500/70 mt-1 flex-shrink-0" />
                                <span>{improvement}</span>
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
