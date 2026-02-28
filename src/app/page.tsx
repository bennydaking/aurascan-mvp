"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, Hexagon, Microscope, TrendingUp, ChevronDown, Lock, Shield, Sparkles } from "lucide-react";
import { ScannerOverlay } from "@/components/ScannerOverlay";
import { ResultsPaywall } from "@/components/ResultsPaywall";
import { BiometricReport } from "@/components/BiometricReport";

type AppState = "idle" | "scanning" | "results" | "report";

interface AnalysisResult {
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

        {/* Global Lighting & Aurora */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0 animate-aurora" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] rounded-full pointer-events-none z-0" />

        {/* Top Left Logo */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50">
          <span className="font-sans font-medium text-white/90 tracking-tight text-lg drop-shadow-sm">
            AURASCAN
          </span>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">

          {/* Header Section */}
          {appState !== "report" && (
            <div className="text-center mb-16 mt-12 md:mt-4 w-full px-4">
              <h1 className="text-[12vw] leading-none md:text-[5.5rem] font-medium mb-6 tracking-tighter text-white drop-shadow-2xl">
                Your Face. Quantified.
              </h1>
              <p className="text-white/60 text-lg md:text-xl font-light tracking-tight max-w-lg mx-auto leading-relaxed">
                The world's most advanced aesthetic engine.<br />98% biometric precision. 100% private.
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
                className="w-full max-w-[320px] aspect-square rounded-[3rem] border border-white/[0.08] bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.03] hover:border-white/[0.15] transition-all duration-700 cursor-pointer flex flex-col items-center justify-center p-8 group relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.02)] hover:shadow-[0_0_80px_rgba(255,255,255,0.05)] mx-auto animate-float"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

                <div className="relative w-16 h-16 mb-6 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.08] transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <Upload className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                </div>

                <div className="relative text-center text-sm font-light text-white/50 tracking-tight">
                  Drag & drop image or<br />
                  <span className="text-white/80 font-medium">click to upload</span>
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

            {appState === "results" && imageUrl && analysisResult && (
              <div className="w-full">
                <ResultsPaywall imageUrl={imageUrl!} data={analysisResult} onUnlock={() => setAppState("report")} />
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

      {/* The Bento Grid Section - Only visible in idle state for clean UX */}
      {appState === "idle" && (
        <section className="w-full relative z-20 pb-32 px-6">
          <div className="max-w-5xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">

              {/* Large Left Card */}
              <div className="md:col-span-2 p-8 md:p-12 rounded-[2.5rem] border border-white-[0.05] bg-white/[0.01] backdrop-blur-2xl hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
                <Hexagon className="w-8 h-8 text-white/80 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium tracking-tight text-3xl mb-4">GLM-4V Vision Engine.</h3>
                <p className="text-base text-white/50 leading-relaxed font-light max-w-sm">Precise algorithmic processing mapping complex facial vectors to evaluate structural harmony with ruthless accuracy.</p>
              </div>

              {/* Stacked Right Cards */}
              <div className="grid grid-rows-2 gap-4">

                {/* Top Right Card */}
                <div className="p-8 pb-10 rounded-[2.5rem] border border-white-[0.05] bg-white/[0.01] backdrop-blur-2xl hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
                  <Shield className="w-7 h-7 text-white/80 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-medium tracking-tight text-xl mb-2">Zero Retention.</h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light">End-to-end encrypted protocol. Files purged in RAM implicitly.</p>
                </div>

                {/* Bottom Right Card */}
                <div className="p-8 pb-10 rounded-[2.5rem] border border-white-[0.05] bg-white/[0.01] backdrop-blur-2xl hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
                  <TrendingUp className="w-7 h-7 text-white/80 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-medium tracking-tight text-xl mb-2">Personalized Roadmap.</h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light">Customized actionable insights to maximize your aesthetic potential.</p>
                </div>

              </div>
            </div>

            <div className="max-w-2xl mx-auto border-t border-white/[0.05] pt-16">
              <h2 className="text-lg font-medium tracking-tight text-white mb-8 text-center">Frequently Asked Queries</h2>
              <div className="space-y-3">
                <details className="group border border-white/[0.05] bg-white/[0.01] rounded-2xl overflow-hidden cursor-pointer hover:bg-white/[0.02] transition-all">
                  <summary className="p-6 font-medium text-[15px] tracking-tight text-white flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                    <span>What level of precision can I expect?</span>
                    <ChevronDown className="w-4 h-4 text-white/50 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-6 pt-0 text-[15px] text-white/50 leading-relaxed border-t border-white/[0.05] font-light">
                    We utilize advanced computer vision matrix-algorithms for 98% granular biometric precision across facial planes.
                  </div>
                </details>
                <details className="group border border-white/[0.05] bg-white/[0.01] rounded-2xl overflow-hidden cursor-pointer hover:bg-white/[0.02] transition-all">
                  <summary className="p-6 font-medium text-[15px] tracking-tight text-white flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                    <span>Is my biometric data stored?</span>
                    <ChevronDown className="w-4 h-4 text-white/50 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-6 pt-0 text-[15px] text-white/50 leading-relaxed border-t border-white/[0.05] font-light">
                    Negative. Uploads are strictly ephemeral, processed entirely in system memory (RAM), and purged securely post-analysis.
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
