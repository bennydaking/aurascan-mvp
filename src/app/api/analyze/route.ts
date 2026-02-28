import { NextResponse } from "next/server";
import { analyzeFaceWithZai, type ZaiFaceAnalysis } from "@/lib/zai";

export const runtime = "nodejs";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toScoreFromCanthalTilt(tilt: number): number {
  return clamp(Math.round(((tilt + 10) / 20) * 100), 0, 100);
}

function toScoreFromGonialAngleClass(gonialAngle: "Low" | "Ideal" | "High"): number {
  if (gonialAngle === "Ideal") return 84;
  if (gonialAngle === "High") return 74;
  return 62;
}

function toScoreFromMidfaceCompactness(midfaceCompactness: number): number {
  const ideal = 0.92;
  const maxDistance = 0.18;
  const distance = Math.abs(midfaceCompactness - ideal);
  return clamp(Math.round(100 - (distance / maxDistance) * 100), 0, 100);
}

function toScoreFromFWHR(fwhr: number): number {
  return clamp(Math.round(((fwhr - 1.4) / (2.2 - 1.4)) * 100), 0, 100);
}

function mapToUiPayload(result: ZaiFaceAnalysis) {
  const score = clamp(result.score, 0, 100);
  const percentile = clamp(result.percentile, 0, 100);
  const symmetry = clamp(result.metrics.symmetry, 0, 100);
  const dermalClarity = clamp(result.metrics.dermalClarity, 0, 100);

  const orbitalScore = toScoreFromCanthalTilt(result.metrics.canthalTilt);
  const projectionScore = toScoreFromGonialAngleClass(result.metrics.gonialAngle);
  const lowerThirdScore = toScoreFromFWHR(result.metrics.fWHR);
  const midfaceScore = toScoreFromMidfaceCompactness(result.metrics.midfaceCompactness);
  const percentileTop = clamp(100 - percentile, 0, 100);
  const optimizationCurrent = clamp(Math.round(score * 0.84 + 6), 0, 100);
  const optimizationProjected = clamp(Math.max(optimizationCurrent + 9, score + 6), 0, 100);

  return {
    locked: true,
    score,
    percentile,
    metrics: {
      canthalTilt: result.metrics.canthalTilt,
      gonialAngle: result.metrics.gonialAngle,
      midfaceCompactness: result.metrics.midfaceCompactness,
      fWHR: result.metrics.fWHR,
      symmetry,
      dermalClarity,
    },
    archetype: result.archetype,
    summary: result.summary,

    // Backward-compatible payload expected by existing UI components.
    harmonyIndex: score,
    globalPercentile: `Top ${percentileTop}%`,
    structuralProfile: result.archetype,
    granularMetrics: [
      {
        label: "Canthal Tilt Alignment",
        value: orbitalScore,
        interpretation: `${result.metrics.canthalTilt.toFixed(1)}°`,
      },
      {
        label: "Jaw Projection Index",
        value: projectionScore,
        interpretation: result.metrics.gonialAngle,
      },
      {
        label: "Lower Third Projection",
        value: lowerThirdScore,
        interpretation: `FWHR ${result.metrics.fWHR.toFixed(2)}`,
      },
      {
        label: "Midface Proportion Ratio",
        value: midfaceScore,
        interpretation: result.metrics.midfaceCompactness.toFixed(2),
      },
      {
        label: "Bilateral Symmetry",
        value: Math.round(symmetry),
        interpretation: "Mapped",
      },
      {
        label: "Skin Clarity Index",
        value: Math.round(dermalClarity),
        interpretation: "Mapped",
      },
    ],
    optimizationPotential: {
      current: optimizationCurrent,
      projected: optimizationProjected,
      text: result.summary,
    },
  };
}

async function readImageBase64(request: Request): Promise<string> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fileEntry = formData.get("image") ?? formData.get("file");

    if (!(fileEntry instanceof File)) {
      throw new Error("FormData field 'image' (or 'file') is required.");
    }

    const arrayBuffer = await fileEntry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = fileEntry.type || "image/jpeg";
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  }

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { imageBase64?: unknown };
    if (typeof body.imageBase64 === "string" && body.imageBase64.trim()) {
      return body.imageBase64;
    }
  }

  throw new Error("Expected multipart/form-data with image or JSON with imageBase64.");
}

export async function POST(request: Request) {
  try {
    const imageBase64 = await readImageBase64(request);
    const result = await analyzeFaceWithZai(imageBase64);
    return NextResponse.json(mapToUiPayload(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected analyze error";
    const status = message.includes("ZAI_API_KEY") ? 503 : message.includes("Expected multipart") || message.includes("FormData field") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
