"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, ScanFace, AlertTriangle, Activity, ChevronDown, Crosshair, Network } from "lucide-react";
import { ScannerOverlay } from "@/components/ScannerOverlay";
import { ResultsPaywall } from "@/components/ResultsPaywall";
import { BiometricReport } from "@/components/BiometricReport";

type AppState = "idle" | "scanning" | "results" | "report";

interface AnalysisResult {
  ratings: {
    symmetry: number;
    jawline: number;
    skin: number;
    overall: number;
  };
  flaws: string[];
  improvements: string[];
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageUrl(URL.createObjectURL(file));
      initiateAnalysis(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageUrl(URL.createObjectURL(file));
      initiateAnalysis(file);
    }
  };

  const initiateAnalysis = async (file: File) => {
    setAppState("scanning");

    // Start min 6s timer for UX/Perceived Value
    const uxTimer = new Promise(resolve => setTimeout(resolve, 6000));

    try {
      const base64 = await fileToBase64(file);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setAnalysisResult(data);

      // Wait for at least the 6s timer to finish
      await uxTimer;
      setAppState("results");
    } catch (err) {
      console.error(err);
      setAppState("idle");
      alert("Biometric analysis failed. Please try a clearer image.");
    }
  };

  const handleReset = () => {
    setAppState("idle");
    setImageUrl(null);
    setAnalysisResult(null);
  };

  return (
    <main className="min-h-screen relative flex flex-col bg-black overflow-y-auto selection:bg-medical-blue selection:text-white">

      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-24 overflow-hidden">

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

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">

          {/* Header Section (Hide if showing full report) */}
          {appState !== "report" && (
            <div className="text-center mb-12 mt-12 md:mt-4 w-full px-4">
              <h1 className="text-[11vw] leading-[1] md:text-7xl font-black mb-2 uppercase tracking-tighter drop-shadow-2xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-[#666666]">THE MIRROR LIES.</span><br />
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-400">DATA DOESN'T.</span>
              </h1>
              <p className="text-white/60 text-sm md:text-base max-w-sm mx-auto leading-relaxed mt-6">
                Precision biometric analysis. 98% accuracy. Unlock your true rating.
              </p>
            </div>
          )}

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
              <div className="w-full max-w-md aspect-square relative rounded-2xl overflow-hidden border border-white/10 bg-clinical-black shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                {imageUrl && (
                  <img src={imageUrl} alt="Target" className="w-full h-full object-cover opacity-40 grayscale filter" />
                )}
                <ScannerOverlay />
              </div>
            )}

            {appState === "results" && imageUrl && (
              <div className="w-full">
                <ResultsPaywall imageUrl={imageUrl} onUnlock={() => setAppState("report")} />
              </div>
            )}

            {appState === "report" && imageUrl && analysisResult && (
              <div className="w-full mt-12 md:mt-0">
                <BiometricReport
                  imageUrl={imageUrl}
                  data={analysisResult}
                  onReset={handleReset}
                />
              </div>
            )}

          </div>

        </div>

      </section>

      {/* The Protocol Section - Only visible in idle state for clean UX */}
      {appState === "idle" && (
        <section className="w-full bg-[#020202] border-t border-white/5 py-24 px-6 relative z-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase text-center mb-12">Analysis Vectors</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-24">
              <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 group">
                <Crosshair className="w-8 h-8 text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-black uppercase tracking-widest text-lg mb-3">Geometric Mapping</h3>
                <p className="text-sm text-white/50 leading-relaxed font-mono">Precise calculation of facial ratios, symmetry scores, and jawline angularity.</p>
              </div>
              <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300 group">
                <AlertTriangle className="w-8 h-8 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-black uppercase tracking-widest text-lg mb-3">Pathology Report</h3>
                <p className="text-sm text-white/50 leading-relaxed font-mono">Identification of negative tilts, asymmetry, and dermal inconsistencies.</p>
              </div>
              <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 group">
                <Network className="w-8 h-8 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-black uppercase tracking-widest text-lg mb-3">Optimization Protocol</h3>
                <p className="text-sm text-white/50 leading-relaxed font-mono">Specific, non-invasive and invasive protocols to maximize your genetic potential.</p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <h2 className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase text-center mb-8">System Queries</h2>
              <div className="space-y-4">
                <details className="group border border-white/10 bg-black/40 rounded-xl overflow-hidden cursor-pointer hover:border-white/20 transition-all open:border-cyan-500/50 open:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <summary className="p-6 font-mono text-sm uppercase tracking-widest text-white flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                    <span>Is this accurate?</span>
                    <ChevronDown className="w-4 h-4 text-cyan-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-6 pt-0 text-sm text-white/60 leading-relaxed border-t border-white/5 font-mono">
                    <span className="text-cyan-500 mr-2">{'>'}</span> We utilize GLM-4V computer vision for 98% biometric precision.
                  </div>
                </details>
                <details className="group border border-white/10 bg-black/40 rounded-xl overflow-hidden cursor-pointer hover:border-white/20 transition-all open:border-cyan-500/50 open:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <summary className="p-6 font-mono text-sm uppercase tracking-widest text-white flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                    <span>Is my photo saved?</span>
                    <ChevronDown className="w-4 h-4 text-cyan-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-6 pt-0 text-sm text-white/60 leading-relaxed border-t border-white/5 font-mono">
                    <span className="text-cyan-500 mr-2">{'>'}</span> Negative. Images are processed in RAM and purged immediately after analysis.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
