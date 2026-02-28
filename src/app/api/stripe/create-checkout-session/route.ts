import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export const runtime = "nodejs";

function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedHost) {
    return `${forwardedProto ?? url.protocol.replace(":", "")}://${forwardedHost}`;
  }

  return url.origin;
}

export async function POST(request: Request) {
  try {
    const origin = getRequestOrigin(request);
    const session = await createCheckoutSession({ origin });
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session";
    const status = message.includes("STRIPE_SECRET_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
