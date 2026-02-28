import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    zai_key_loaded: Boolean(process.env.ZAI_API_KEY),
  });
}
