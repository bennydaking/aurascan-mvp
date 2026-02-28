"use client";

import { Lock } from "lucide-react";
import Image from "next/image";

interface ResultsPaywallProps {
    imageUrl: string;
}

export function ResultsPaywall({ imageUrl }: ResultsPaywallProps) {
    return (
        <div className="w-full max-w-md mx-auto relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl mt-8">

            {/* Heavily Blurred Result Preview Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-black/50">
                <Image
                    src={imageUrl}
                    alt="Biometric Scan Complete"
                    fill
                    className="object-cover opacity-60 filter blur-xl scale-110"
                />

                {/* Overlay Grid */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Face targeting lines mock */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border border-medical-blue/30 rounded-full box-border shadow-[0_0_15px_rgba(59,130,246,0.3)] pointer-events-none" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-medical-blue/20 pointer-events-none" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-medical-blue/20 pointer-events-none" />
            </div>

            {/* Paywall CLI-like Box */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                <div className="w-full bg-clinical-black border border-white/10 rounded-xl p-6 text-center shadow-lg relative overflow-hidden backdrop-blur-md">

                    <div className="absolute top-0 left-0 w-full h-1 bg-medical-blue/20 animate-pulse" />

                    <h3 className="uppercase tracking-widest text-xs font-mono text-white/50 mb-2">Biometric Analysis Complete</h3>

                    <div className="text-2xl font-bold font-sans tracking-tight mb-6 text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Potential Tier: <span className="text-medical-blue">Top 15%</span>
                    </div>

                    <p className="text-sm text-white/60 mb-8 max-w-[280px] mx-auto leading-relaxed">
                        Data acquired. Structural anomalies and peak harmonies isolated.
                    </p>

                    <button className="relative w-full group overflow-hidden bg-white text-black font-semibold py-4 px-6 rounded-lg transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-2 focus:ring-offset-black">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            Unlock Full Report ($2.99)
                        </span>
                    </button>

                    <div className="mt-4 text-[10px] uppercase font-mono tracking-widest text-white/30 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-medical-blue animate-pulse" />
                        End-to-end encrypted
                    </div>
                </div>
            </div>
        </div>
    );
}
