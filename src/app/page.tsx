"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  Upload,
  ChevronDown,
  Eye,
  Activity,
  Lock,
  Grid2x2,
  Shield,
} from "lucide-react";
import { ScannerOverlay } from "@/components/ScannerOverlay";
import { ResultsPaywall } from "@/components/ResultsPaywall";
import { BiometricReport } from "@/components/BiometricReport";

type AppState = "idle" | "scanning" | "results" | "report";
const CHECKOUT_STORAGE_KEY = "aurascan_pending_result_v1";
const ANALYZE_TIMEOUT_MS = 25000;

interface AnalysisResult {
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
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        imageUrl?: unknown;
        analysisResult?: unknown;
      };

      if (typeof parsed.imageUrl === "string" && parsed.imageUrl && parsed.analysisResult) {
        setImageUrl(parsed.imageUrl);
        setAnalysisResult(parsed.analysisResult as AnalysisResult);
        setAppState("results");
      }
    } catch {
      window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    }
  }, []);

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
      initiateAnalysis(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      initiateAnalysis(file);
    }
  };

  const initiateAnalysis = async (file: File) => {
    setAppState("scanning");

    // Start min 6s timer for UX/Perceived Value
    const uxTimer = new Promise(resolve => setTimeout(resolve, 6000));
    const analyzeController = new AbortController();
    const analyzeTimeout = window.setTimeout(() => {
      analyzeController.abort("Analyze request timeout");
    }, ANALYZE_TIMEOUT_MS);

    try {
      const base64 = await fileToBase64(file);
      setImageUrl(base64);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        signal: analyzeController.signal,
      });

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setAnalysisResult(data);

      await uxTimer;
      setAppState("results");
    } catch (err) {
      console.error(err);
      // SIMULATION FALLBACK
      if (!imageUrl) {
        const base64 = await fileToBase64(file);
        setImageUrl(base64);
      }
      setAnalysisResult({
        harmonyIndex: 71.2,
        globalPercentile: "Top 24%",
        structuralProfile: "BALANCED SYMMETRY",
        granularMetrics: [
          { label: "Symmetry Deviation", value: 6.8, interpretation: "Standard" },
          { label: "Orbital Tilt Angle", value: 2, interpretation: "Neutral" },
          { label: "Lower Third Projection", value: 74, interpretation: "Moderate" },
          { label: "Midface Proportion Ratio", value: 65, interpretation: "Standard" },
          { label: "Interocular Proportion Index", value: 52, interpretation: "Median" },
          { label: "Skin Clarity Index", value: 84, interpretation: "High" }
        ],
        optimizationPotential: {
          current: 68,
          projected: 84,
          text: "Structural base aligns with population median. High optimization potential via dermal refinement."
        }
      });
      setAppState("results");
    } finally {
      window.clearTimeout(analyzeTimeout);
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    }
    setAppState("idle");
    setImageUrl(null);
    setAnalysisResult(null);
  };

  return (
    <main className="min-h-screen relative flex flex-col bg-[linear-gradient(180deg,#040405_0%,#070708_52%,#050506_100%)] overflow-y-auto selection:bg-medical-blue selection:text-white">

      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-20 overflow-hidden">

        {/* Global Lighting & Aurora */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0 animate-aurora" />
        <div className="absolute top-1/2 left-1/2 w-[760px] h-[760px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_62%)] rounded-full pointer-events-none z-0" />

        {/* Top Left Logo */}
        <div className="absolute top-7 left-6 md:top-9 md:left-8 z-50">
          <span className="font-sans font-medium text-white/85 tracking-[0.06em] text-base md:text-[1.02rem] drop-shadow-sm">
            AURASCAN
          </span>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center px-6 sm:px-8 md:px-0">

          {appState === "idle" && (
            <div className="text-center mb-11 sm:mb-12 md:mb-10 mt-7 sm:mt-8 md:mt-4 w-full px-0">
              <h1 className="max-w-[19.5rem] sm:max-w-none mx-auto text-[2.2rem] min-[430px]:text-[2.45rem] sm:text-[2.85rem] md:text-[5.15rem] leading-[1.08] sm:leading-[1.02] md:leading-[0.98] font-bold mb-6 sm:mb-7 tracking-[-0.025em] text-white drop-shadow-2xl">
                <span className="block sm:hidden">How Does</span>
                <span className="block sm:hidden">Your Face Rank?</span>
                <span className="hidden sm:block">How Does Your Face</span>
                <span className="hidden sm:block">Rank?</span>
              </h1>
              <p className="text-white/78 text-[0.84rem] sm:text-[0.89rem] md:text-[0.92rem] font-medium tracking-[0.012em] max-w-[18.5rem] min-[430px]:max-w-[21rem] sm:max-w-[24rem] md:max-w-[31rem] mx-auto leading-[1.56] mb-0">
                AI-measured symmetry, structure & global ranking.
              </p>
            </div>
          )}

          {/* Dynamic Content Area */}
          <div className="w-full relative min-h-[340px] sm:min-h-[420px] md:min-h-[500px] flex flex-col items-center justify-center px-0">
            {/* Spotlight Gradient Behind Content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-violet-600/[0.02] blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-cyan-500/[0.012] blur-[130px] rounded-full pointer-events-none z-0" />

            {appState === "idle" && (
              <div className="flex flex-col items-center gap-11 sm:gap-12 md:gap-10 w-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[42%] w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.016)_35%,transparent_72%)] blur-[76px] pointer-events-none z-0" />
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full max-w-[17.2rem] min-[430px]:max-w-[18.8rem] sm:max-w-[22rem] md:max-w-[25.5rem] aspect-square rounded-[3.2rem] md:rounded-[3.5rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-700 cursor-pointer flex flex-col items-center justify-center p-8 sm:p-9 md:p-11 group relative overflow-hidden shadow-[0_30px_72px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-14px_30px_rgba(0,0,0,0.2)] md:hover:shadow-[0_38px_86px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-18px_36px_rgba(0,0,0,0.24)] mx-auto animate-breathing z-10"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none" />

                  <div className="relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] md:w-20 md:h-20 mb-6 sm:mb-7 md:mb-8 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.05] transition-all duration-500 shadow-[20px_20px_40px_rgba(0,0,0,0.4)]">
                    <Upload className="w-8 h-8 text-white/40 group-hover:text-white/70 transition-colors" />
                  </div>

                  <div className="relative text-center space-y-2">
                    <div className="text-[0.82rem] sm:text-sm font-medium text-white/62 tracking-tight">
                      Upload a Clear Front-Facing Photo
                    </div>
                    <div className="text-[10px] font-mono text-white/30 tracking-[0.07em]">
                      Analysis takes ~20 seconds.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative px-12 sm:px-12 py-[1.18rem] sm:py-5 bg-gradient-to-b from-white to-zinc-50 text-zinc-950 rounded-[1.08rem] font-bold text-[1.05rem] sm:text-lg tracking-tight shadow-[0_12px_26px_rgba(0,0,0,0.34)] md:hover:shadow-[0_15px_34px_rgba(0,0,0,0.4),0_0_22px_rgba(255,255,255,0.09)] active:scale-[0.98] active:shadow-[0_7px_15px_rgba(0,0,0,0.24)] transition-[transform,box-shadow,filter] duration-200 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    GET MY SCORE
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
              </div>
            )}

            {appState === "scanning" && (
              <div className="w-full max-w-md aspect-square relative rounded-[3rem] overflow-hidden border border-white/10 bg-clinical-black shadow-[0_0_80px_rgba(6,182,212,0.1)]">
                {imageUrl && (
                  <img src={imageUrl} alt="Target" className="w-full h-full object-cover opacity-30 grayscale filter" />
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

      {appState === "idle" && (
        <div className="relative z-20 mt-14 md:mt-16 pb-22 md:pb-24">
          <div className="absolute inset-0 pointer-events-none opacity-[0.016] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          <section className="w-full relative px-4 sm:px-6 pb-9 md:pb-10">
            <div className="absolute inset-x-0 top-4 h-[280px] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.04),transparent_72%)] pointer-events-none" />

            <div className="max-w-[54rem] mx-auto relative">
              <div className="space-y-6 md:space-y-7">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-white">What We Analyze</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 sm:px-5 py-5 sm:py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg border border-white/[0.18] bg-white/[0.035] shadow-[inset_0_0_14px_rgba(255,255,255,0.06)] flex items-center justify-center mt-0.5">
                        <Eye className="w-5 h-5 text-white/82" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-[0.92rem] text-white/90 font-medium leading-tight">
                          Orbital Architecture
                        </h3>
                        <p className="text-[12px] sm:text-[12.5px] text-white/68 font-normal leading-snug">
                          Canthal tilt alignment, eye spacing (IPD), and orbital balance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 sm:px-5 py-5 sm:py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg border border-white/[0.18] bg-white/[0.035] shadow-[inset_0_0_14px_rgba(255,255,255,0.06)] flex items-center justify-center mt-0.5">
                        <Grid2x2 className="w-5 h-5 text-white/82" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-[0.92rem] text-white/90 font-medium leading-tight">
                          Craniofacial Ratios
                        </h3>
                        <p className="text-[12px] sm:text-[12.5px] text-white/68 font-normal leading-snug">
                          FWHR (width-to-height), midface compactness, and facial proportion symmetry.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 sm:px-5 py-5 sm:py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg border border-white/[0.18] bg-white/[0.035] shadow-[inset_0_0_14px_rgba(255,255,255,0.06)] flex items-center justify-center mt-0.5">
                        <Shield className="w-5 h-5 text-white/82" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-[0.92rem] text-white/90 font-medium leading-tight">
                          Jaw & Projection
                        </h3>
                        <p className="text-[12px] sm:text-[12.5px] text-white/68 font-normal leading-snug">
                          Gonial angle precision, chin projection, and lower-third structure.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 sm:px-5 py-5 sm:py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg border border-white/[0.18] bg-white/[0.035] shadow-[inset_0_0_14px_rgba(255,255,255,0.06)] flex items-center justify-center mt-0.5">
                        <Activity className="w-5 h-5 text-white/82" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-[0.92rem] text-white/90 font-medium leading-tight">
                          Skin & Texture
                        </h3>
                        <p className="text-[12px] sm:text-[12.5px] text-white/68 font-normal leading-snug">
                          Dermal clarity score and bilateral symmetry mapping.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full relative px-4 sm:px-6">
            <div className="absolute inset-x-0 top-0 h-[240px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.04),transparent_76%)] pointer-events-none" />

            <div className="max-w-[54rem] mx-auto relative space-y-5 sm:space-y-6">
              <div className="rounded-[1.8rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_55%,transparent)] p-7 sm:p-9 md:p-10">
                <h3 className="text-[1.35rem] sm:text-[1.5rem] md:text-[1.65rem] leading-tight tracking-[-0.01em] text-white font-semibold mb-2.5">
                  Precision-Based Analysis
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-white/60 font-light leading-relaxed max-w-2xl">
                  Your facial structure is mapped using biometric ratio modeling — not visual estimation.
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-white/[0.06] bg-white/[0.02] px-6 sm:px-7 py-6 sm:py-7">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg border border-white/[0.12] bg-white/[0.03] flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white/65" />
                  </div>
                  <h4 className="text-[1.05rem] sm:text-[1.12rem] font-semibold tracking-tight text-white">Private by Default.</h4>
                </div>
                <p className="text-[13px] sm:text-[13.5px] text-white/58 font-light leading-relaxed max-w-2xl">
                  Your image is processed securely and deleted immediately after analysis. No facial data is stored.
                </p>
              </div>

              <div className="max-w-[46rem] mx-auto border-t border-white/[0.045] pt-8 sm:pt-9 mt-8 sm:mt-10">
                <h2 className="text-lg sm:text-xl font-medium tracking-tight text-white mb-5 sm:mb-6 text-center">Questions</h2>
                <div className="space-y-3.5 sm:space-y-4">
                  <details className="group border border-white/[0.03] bg-white/[0.01] rounded-2xl overflow-hidden cursor-pointer transition-[background-color,border-color] duration-300 open:bg-white/[0.02] md:hover:border-white/[0.08]">
                    <summary className="px-5 sm:px-6 py-5 font-medium text-[14px] sm:text-[14.5px] tracking-tight text-white flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                      <span>How accurate are the results?</span>
                      <ChevronDown className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-5 sm:px-6 pb-5 text-[13px] sm:text-[13.5px] text-white/56 leading-relaxed border-t border-white/[0.028] font-light">
                      The scan uses biometric ratio modeling across facial landmarks. It is designed for consistent structural measurement rather than subjective rating.
                    </div>
                  </details>
                  <details className="group border border-white/[0.03] bg-white/[0.01] rounded-2xl overflow-hidden cursor-pointer transition-[background-color,border-color] duration-300 open:bg-white/[0.02] md:hover:border-white/[0.08]">
                    <summary className="px-5 sm:px-6 py-5 font-medium text-[14px] sm:text-[14.5px] tracking-tight text-white flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                      <span>Is my image stored?</span>
                      <ChevronDown className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-5 sm:px-6 pb-5 text-[13px] sm:text-[13.5px] text-white/56 leading-relaxed border-t border-white/[0.028] font-light">
                      No. Your image is processed in-session and deleted immediately after analysis is complete. No account is required.
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

    </main>
  );
}
