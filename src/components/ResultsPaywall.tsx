"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Lock } from "lucide-react";

interface ResultsPaywallProps {
  imageUrl: string;
  data: {
    harmonyIndex: number;
    globalPercentile: string;
    structuralProfile: string;
    granularMetrics: {
      label: string;
      value: number;
    }[];
  };
  onUnlock: () => void;
}
const CHECKOUT_STORAGE_KEY = "aurascan_pending_result_v1";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function findMetric(data: ResultsPaywallProps["data"], keywords: string[], fallback: number): number {
  const metric = data.granularMetrics.find((m) =>
    keywords.some((k) => m.label.toLowerCase().includes(k)),
  );
  return clampScore(metric?.value ?? fallback);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function ResultsPaywall({ imageUrl, data, onUnlock }: ResultsPaywallProps) {
  const [step, setStep] = useState<"locked" | "processing" | "unlocked">("locked");
  void onUnlock;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const checkoutState = params.get("checkout");
    const sessionId = params.get("session_id");

    if (!checkoutState) return;

    const clearQuery = () => {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete("checkout");
      nextUrl.searchParams.delete("session_id");
      window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    };

    if (checkoutState === "cancel") {
      setStep("locked");
      clearQuery();
      return;
    }

    if (checkoutState === "success" && sessionId) {
      const verify = async () => {
        setStep("processing");

        try {
          const response = await fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`);
          if (!response.ok) {
            throw new Error("Payment verification failed");
          }

          const payload = (await response.json()) as { paid?: boolean };
          if (payload.paid) {
            setStep("unlocked");
            window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
          } else {
            setStep("locked");
          }
        } catch {
          setStep("locked");
        } finally {
          clearQuery();
        }
      };

      void verify();
    }
  }, []);

  const overall = clampScore(data.harmonyIndex);
  const projection = findMetric(data, ["projection", "jaw"], Math.min(95, overall + 5));
  const lowerThird = findMetric(data, ["lower third", "chin"], Math.max(54, overall - 2));
  const midface = findMetric(data, ["midface"], Math.max(52, overall - 3));
  const orbital = findMetric(data, ["orbital", "interocular", "tilt"], Math.max(50, overall - 4));
  const symmetry = findMetric(data, ["symmetry"], Math.min(96, overall + 7));
  const dermal = findMetric(data, ["skin", "clarity"], Math.min(92, overall + 3));
  const percentileMatch = data.globalPercentile.match(/\d+/);
  const topPercentile = percentileMatch ? Number(percentileMatch[0]) : 24;
  const canthalTilt = Number((((orbital - 50) / 50) * 10).toFixed(1));

  const cards = useMemo(
    () => [
      {
        label: "Canthal Tilt Alignment",
        valueText: `${canthalTilt > 0 ? "+" : ""}${canthalTilt.toFixed(1)}°`,
        context: canthalTilt >= 0 ? "Above neutral range." : "Below neutral range.",
        progress: clamp((orbital / 100) * 100, 0, 100),
        type: "tilt" as const,
      },
      {
        label: "Gonial Angle Precision",
        valueText: `${Math.round(122 - (projection - 70) * 0.2)}° (Ideal Range)`,
        context: "Within ideal angular range.",
        progress: clamp(70 + (projection - 60), 0, 100),
      },
      {
        label: "Midface Compactness",
        valueText: `${(1.02 - (midface / 100) * 0.12).toFixed(2)} (Compact)`,
        context: "Within compact structural range.",
        progress: clamp(100 - (1.02 - (midface / 100) * 0.12 - 0.85) * 500, 0, 100),
      },
      {
        label: "Facial Width Proportion (FWHR)",
        valueText: `${(1.7 + (lowerThird / 100) * 0.28).toFixed(2)} (High)`,
        context: "Indicates strong facial width ratio.",
        progress: clamp(65 + lowerThird * 0.35, 0, 100),
      },
      {
        label: "Bilateral Symmetry",
        valueText: `${(89 + symmetry / 16).toFixed(1)}%`,
        context: "Top 5% of population.",
        progress: clamp(74 + symmetry * 0.26, 0, 100),
      },
      {
        label: "Dermal Clarity Score",
        valueText: `${Math.round(clamp(dermal + 2, 0, 100))}/100`,
        context: "Clear skin with minor texture variation.",
        progress: clamp(dermal + 2, 0, 100),
      },
    ],
    [orbital, projection, midface, lowerThird, symmetry, dermal, canthalTilt],
  );

  const unlock = async () => {
    if (typeof window === "undefined") return;

    setStep("processing");

    window.sessionStorage.setItem(
      CHECKOUT_STORAGE_KEY,
      JSON.stringify({
        imageUrl,
        analysisResult: data,
        savedAt: Date.now(),
      }),
    );

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to initialize checkout");
      }

      const payload = (await response.json()) as { url?: string };
      if (!payload.url) {
        throw new Error("Missing Stripe checkout URL");
      }

      window.location.href = payload.url;
    } catch (error) {
      console.error(error);
      setStep("locked");
    }
  };

  return (
    <div className="w-full max-w-[44rem] mx-auto mt-6 sm:mt-8 rounded-[2.2rem] border border-white/[0.08] bg-black/65 backdrop-blur-xl overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.08),transparent_60%)]" />

      {step === "locked" && (
        <div className="relative p-6 sm:p-8 md:p-10 space-y-9 sm:space-y-10 text-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/76 font-mono mb-4">
              Analysis Complete
            </div>
            <h2 className="text-[1.6rem] sm:text-[1.9rem] font-semibold text-white tracking-tight leading-tight mb-4">
              Your Structural Profile Is Ready.
            </h2>
          </div>

          <section className="rounded-[1.5rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-6 sm:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <h3 className="text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-[0.01em] text-white mb-3">
              Aesthetic Harmony Index
            </h3>
            <div className="mx-auto w-[5.4rem] h-[5.4rem] rounded-full border border-cyan-200/30 flex items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_62%)] mb-3 shadow-[0_0_24px_rgba(103,232,249,0.12),inset_0_0_16px_rgba(255,255,255,0.08)] relative overflow-hidden">
              <Lock className="w-6 h-6 text-cyan-100/90" />
            </div>
            <p className="text-[13px] text-white/60">Your global rank is ready.</p>
          </section>

          <section className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7">
            <h3 className="text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-tight text-white mb-4">
              Detected Structural Pattern
            </h3>
            <div className="text-[1.35rem] sm:text-[1.55rem] font-medium tracking-tight text-white leading-tight">
              High Contrast Profile
            </div>
            <p className="mt-2 text-[12px] text-white/48">Distinct structural intensity detected.</p>
          </section>

          <section>
            <div className="mb-3.5">
              <span className="inline-flex items-center rounded-full border border-cyan-200/30 bg-cyan-100/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-cyan-100/80 font-mono">
                Early Launch Price
              </span>
            </div>
            <button
              onClick={unlock}
              className="w-full max-w-[27rem] mx-auto bg-white text-black font-semibold text-[15px] sm:text-base py-4.5 sm:py-5 px-6 rounded-[1.15rem] shadow-[0_12px_24px_rgba(0,0,0,0.3)] hover:brightness-[1.02] hover:shadow-[0_14px_28px_rgba(0,0,0,0.34)] active:scale-[0.99] transition-[filter,box-shadow,transform] duration-150"
            >
              Reveal My Results — $2.99
            </button>
            <div className="mt-4 text-[11px] text-white/44 leading-relaxed max-w-[32rem] mx-auto">
              One-time payment. Instant unlock.
            </div>
          </section>
        </div>
      )}

      {step === "processing" && (
        <div className="relative py-14 sm:py-16 px-6 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-white/75 mb-5" />
          <div className="text-lg font-medium text-white tracking-tight mb-2">Unlocking Report</div>
        </div>
      )}

      {step === "unlocked" && (
        <div className="relative p-6 sm:p-8 md:p-10 space-y-12 sm:space-y-14">
          <section className="text-center">
            <h2 className="text-[1.35rem] sm:text-[1.5rem] font-semibold tracking-tight text-white mb-4">
              Aesthetic Harmony Score
            </h2>
            <div className="text-[4rem] sm:text-[4.5rem] font-semibold leading-none tracking-[-0.03em] text-white mb-2">
              {overall}
            </div>
            <p className="text-sm text-white/74 mb-1.5">Top {topPercentile}% Globally</p>
            <div className="h-[4px] max-w-sm mx-auto rounded-full bg-white/[0.09] overflow-hidden mt-5">
              <div className="h-full rounded-full bg-cyan-300/70" style={{ width: `${overall}%` }} />
            </div>
          </section>

          <section className="pt-1.5 sm:pt-2">
            <h3 className="text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-tight text-white mb-2 text-center">
              Structural Analysis Summary
            </h3>
            <p className="text-[12px] sm:text-[13px] text-white/58 leading-relaxed text-center max-w-[40rem] mx-auto mb-5">
              Strong projection depth and high bilateral symmetry place you above global average.
            </p>
            <h3 className="text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-tight text-white mb-4 text-center">
              Structural Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.2rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 sm:px-6 py-5 sm:py-6"
                >
                  <div className="text-[13px] sm:text-[13.5px] text-white/72 mb-2.5">{card.label}</div>
                  <div className="text-[1.08rem] sm:text-[1.18rem] font-semibold leading-snug tracking-tight text-white mb-2.5">
                    {card.valueText}
                  </div>
                  <div className="text-[11px] sm:text-[11.5px] text-white/56 mb-3 leading-snug">{card.context}</div>

                  {card.type === "tilt" ? (
                    <div>
                      <div className="relative h-[2px] rounded-full bg-white/[0.14] mb-2">
                        <div className="absolute inset-y-0 left-1/2 w-px bg-white/35" />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300/80"
                          style={{ left: `calc(${card.progress}% - 4px)` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-white/42 font-mono">
                        <span>-10°</span>
                        <span>+10°</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[2px] rounded-full bg-white/[0.1] overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-300/75" style={{ width: `${card.progress}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 text-center">
            <h3 className="text-[1.12rem] sm:text-[1.25rem] font-semibold tracking-tight text-white mb-2">
              Your Structural Archetype
            </h3>
            <div className="text-[1.45rem] sm:text-[1.7rem] font-medium tracking-tight text-white mb-3 leading-tight">
              High Contrast Angularity
            </div>
            <p className="text-[13px] sm:text-[13.5px] text-white/58 leading-relaxed max-w-[34rem] mx-auto">
              Defined projection depth and pronounced contrast distribution create a visually dominant structure associated with high memorability and presence.
            </p>
          </section>

          <section className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 text-center mt-2 sm:mt-3">
            <h3 className="text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-tight text-white mb-2">
              Structural Ceiling
            </h3>
            <div className="text-sm text-cyan-300/90 mb-2">High</div>
            <p className="text-[13px] sm:text-[13.5px] text-white/58 leading-relaxed">
              Your facial structure shows strong optimization potential with targeted refinement.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
