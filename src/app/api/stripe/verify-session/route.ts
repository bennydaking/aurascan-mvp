import { NextResponse } from "next/server";
import { retrieveCheckoutSession } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const session = await retrieveCheckoutSession(sessionId);
    const paid = session.payment_status === "paid" && session.status === "complete";

    return NextResponse.json({
      paid,
      payment_status: session.payment_status,
      status: session.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify checkout session";
    const status = message.includes("STRIPE_SECRET_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
