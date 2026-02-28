"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { ScannerOverlay } from "@/components/ScannerOverlay";
import { ResultsPaywall } from "@/components/ResultsPaywall";

type AppState = "idle" | "scanning" | "results";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      startScanFlow();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      startScanFlow();
    }
  };

  const startScanFlow = () => {
    setAppState("scanning");

    // Simulate the scanning process for massive perceived value (cold & judging vibe)
    setTimeout(() => {
      setAppState("results");
    }, 6000); // 6 seconds of cycling niche terms
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 md:p-24 overflow-hidden selection:bg-medical-blue selection:text-white">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient Glow (Breathing) */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] rounded-full pointer-events-none animate-breathing z-0" />

      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50">
        <span className="font-sans font-bold text-white tracking-widest text-lg lg:text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          AURASCAN
        </span>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">

        {/* Header Section */}
        <div className="text-center mb-12 mt-12 md:mt-4 w-full px-4">
          <h1 className="text-[11vw] leading-[1] md:text-7xl font-black mb-2 uppercase tracking-tighter drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-[#666666]">THE MIRROR LIES.</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-400">DATA DOESN'T.</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-sm mx-auto leading-relaxed mt-6">
            Precision biometric analysis. 98% accuracy. Unlock your true rating.
          </p>
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full relative min-h-[400px] flex items-center justify-center">

          {appState === "idle" && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-8 group relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] mx-4 md:mx-0"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              {/* Scanner Line Animation */}
              <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none animate-scanner" />

              {/* Targeting Corner Brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/20 pointer-events-none group-hover:border-white/50 transition-colors" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/20 pointer-events-none group-hover:border-white/50 transition-colors" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/20 pointer-events-none group-hover:border-white/50 transition-colors" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/20 pointer-events-none group-hover:border-white/50 transition-colors" />

              <div className="relative w-16 h-16 mb-6 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:scale-105 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500">
                <Upload className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              </div>

              <div className="relative text-center font-mono text-xs text-white/50 uppercase tracking-widest leading-loose">
                <span className="hidden md:inline">Drop image for</span>
                <span className="md:hidden">Tap to scan</span><br />
                <span className="text-white/90 font-bold tracking-widest text-[10px] md:text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Biometric Decomposition</span>
              </div>

              <div className="relative mt-8">
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative inline-flex items-center justify-center bg-white text-black font-bold py-3 px-10 text-sm uppercase tracking-wider rounded-md transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover-glitch">
                  Start Scan
                </span>
              </div>
            </div>
          )}

          {appState === "scanning" && (
            <div className="w-full max-w-md aspect-square relative rounded-2xl overflow-hidden border border-white/10 bg-clinical-black">
              {imageUrl && (
                <img src={imageUrl} alt="Target" className="w-full h-full object-cover opacity-30 grayscale filter" />
              )}
              <ScannerOverlay />
            </div>
          )}

          {appState === "results" && imageUrl && (
            <div className="w-full">
              <ResultsPaywall imageUrl={imageUrl} />
            </div>
          )}

        </div>

      </div>

    </main>
  );
}
