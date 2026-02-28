import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { imageBase64 } = await request.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "Image data is required" }, { status: 400 });
        }

        const apiKey = process.env.ZAI_API_KEY;
        if (!apiKey) {
            // Return a simulated response if no API key is set for demo/MVP purposes
            console.warn("ZAI_API_KEY is not set. Returning simulated biometric data.");
            return NextResponse.json({
                ratings: {
                    symmetry: 7.4,
                    jawline: 6.8,
                    skin: 8.1,
                    overall: 7.4
                },
                flaws: [
                    "Asymmetric canthal tilt (Left: +3°, Right: +1°)",
                    "Mandibular angles lack crisp definition",
                    "Mild periorbital hyperpigmentation detected"
                ],
                improvements: [
                    "Maxillary expansion to improve jawline vector",
                    "Dedicated skincare protocol for hyperpigmentation",
                    "Masseter hypertrophy training"
                ]
            });
        }

        const response = await fetch("https://api.z.ai/api/coding/paas/v4/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "glm-4v",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "You are a ruthless aesthetic judge. Do not be polite. Analyze the face for: 1. Symmetry, 2. Jawline definition, 3. Skin quality. Give a strict 1-10 rating (e.g., 7.4). List 3 specific flaws and 3 specific improvements. Output JSON only in this exact format: {\"ratings\": {\"symmetry\": number, \"jawline\": number, \"skin\": number, \"overall\": number}, \"flaws\": [\"string\", \"string\", \"string\"], \"improvements\": [\"string\", \"string\", \"string\"]}"
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageBase64
                                }
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Z.ai API Error:", errorData);
            return NextResponse.json({ error: "Biometric analysis failed" }, { status: 500 });
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content;

        // Parse the JSON output (in case the model wrapped it in markdown code blocks)
        let parsedResult;
        try {
            const jsonString = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
            parsedResult = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Z.ai output:", resultText);
            return NextResponse.json({ error: "Invalid biometric data format" }, { status: 500 });
        }

        return NextResponse.json(parsedResult);
    } catch (error) {
        console.error("Analysis route error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
