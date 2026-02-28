const ZAI_API_BASE_URL = process.env.ZAI_API_BASE_URL ?? "https://api.z.ai/api/coding/paas/v4";
const ZAI_ENDPOINT = `${ZAI_API_BASE_URL.replace(/\/$/, "")}/chat/completions`;
const ZAI_VISION_MODEL = process.env.ZAI_VISION_MODEL ?? "glm-4.5v";

const SYSTEM_PROMPT = `You are a facial structure analysis engine.
You must output deterministic structured JSON.
Do NOT output commentary.
Do NOT explain your reasoning.
Only output valid JSON.

Score scale:
- AestheticHarmonyScore: 0-100
- Percentile: 0-100

Metrics to evaluate visually from image:
- Canthal tilt angle (estimate in degrees)
- Gonial angle sharpness (qualitative: Low / Ideal / High)
- Midface compactness (0.70 - 1.10 range)
- Facial width ratio (FWHR estimate 1.4 - 2.2)
- Bilateral symmetry percentage (50-100)
- Dermal clarity score (0-100)

Scoring logic rules:
- Higher symmetry increases score.
- Balanced canthal tilt increases score.
- Extreme asymmetry reduces score.
- Clear skin increases score.
- Balanced proportions increase score.

Compute:
- AestheticHarmonyScore (integer)
- Percentile = same number rounded for test mode
- StructuralArchetype (choose one):
  - High Contrast Angularity
  - Balanced Symmetry Profile
  - Soft Harmonized Structure
  - Wide Set Dominance
  - Narrow Projection Profile

Return EXACT JSON in this structure:

{
  "score": 0,
  "percentile": 0,
  "metrics": {
    "canthalTilt": 0,
    "gonialAngle": "",
    "midfaceCompactness": 0,
    "fWHR": 0,
    "symmetry": 0,
    "dermalClarity": 0
  },
  "archetype": "",
  "summary": ""
}

Do NOT return markdown.
Do NOT wrap in backticks.
Return pure JSON only.`;

type GonialAngleClass = "Low" | "Ideal" | "High";

export interface ZaiFaceAnalysis {
  score: number;
  percentile: number;
  metrics: {
    canthalTilt: number;
    gonialAngle: GonialAngleClass;
    midfaceCompactness: number;
    fWHR: number;
    symmetry: number;
    dermalClarity: number;
  };
  archetype: string;
  summary: string;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function parseGonialAngle(value: unknown): GonialAngleClass {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized.includes("low")) return "Low";
  if (normalized.includes("high")) return "High";
  return "Ideal";
}

function stripCodeFences(raw: string): string {
  return raw.replace(/```json/gi, "").replace(/```/g, "").trim();
}

function extractContentPayload(content: unknown): unknown {
  if (typeof content === "string") return stripCodeFences(content);

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("")
      .trim();
    return stripCodeFences(text);
  }

  return content;
}

function parseAndValidate(raw: unknown): ZaiFaceAnalysis {
  const payload = raw && typeof raw === "object" ? raw : {};
  const metricsRaw = "metrics" in payload && payload.metrics && typeof payload.metrics === "object"
    ? payload.metrics
    : {};

  const score = Math.round(clampNumber("score" in payload ? payload.score : undefined, 0, 100, 0));
  const percentile = Math.round(clampNumber("percentile" in payload ? payload.percentile : undefined, 0, 100, score));
  const canthalTilt = Number(clampNumber("canthalTilt" in metricsRaw ? metricsRaw.canthalTilt : undefined, -10, 10, 0).toFixed(1));
  const midfaceCompactness = Number(clampNumber("midfaceCompactness" in metricsRaw ? metricsRaw.midfaceCompactness : undefined, 0.7, 1.1, 0.92).toFixed(2));
  const fWHR = Number(clampNumber("fWHR" in metricsRaw ? metricsRaw.fWHR : undefined, 1.4, 2.2, 1.85).toFixed(2));
  const symmetry = Number(clampNumber("symmetry" in metricsRaw ? metricsRaw.symmetry : undefined, 0, 100, 80).toFixed(1));
  const dermalClarity = Number(clampNumber("dermalClarity" in metricsRaw ? metricsRaw.dermalClarity : undefined, 0, 100, 80).toFixed(1));

  const archetype =
    "archetype" in payload && typeof payload.archetype === "string" && payload.archetype.trim()
      ? payload.archetype.trim()
      : "Balanced Symmetry Profile";

  const summary =
    "summary" in payload && typeof payload.summary === "string" && payload.summary.trim()
      ? payload.summary.trim()
      : "Facial structure indicates balanced geometry with moderate asymmetry concentration.";

  return {
    score,
    percentile,
    metrics: {
      canthalTilt,
      gonialAngle: parseGonialAngle("gonialAngle" in metricsRaw ? metricsRaw.gonialAngle : undefined),
      midfaceCompactness,
      fWHR,
      symmetry,
      dermalClarity,
    },
    archetype,
    summary,
  };
}

export async function analyzeFaceWithZai(imageBase64: string): Promise<ZaiFaceAnalysis> {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    throw new Error("ZAI_API_KEY is not configured");
  }

  let response: Response;
  try {
    response = await fetch(ZAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model: ZAI_VISION_MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this face image and return JSON only." },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
      throw new Error("z.ai request timed out");
    }
    throw error;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`z.ai request failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  const normalizedContent = extractContentPayload(content);

  let parsed: unknown;
  if (typeof normalizedContent === "string") {
    try {
      parsed = JSON.parse(normalizedContent);
    } catch {
      throw new Error("Invalid JSON from z.ai Vision");
    }
  } else if (normalizedContent && typeof normalizedContent === "object") {
    parsed = normalizedContent;
  } else {
    throw new Error("Empty response content from z.ai Vision");
  }

  return parseAndValidate(parsed);
}
