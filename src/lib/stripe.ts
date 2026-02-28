const STRIPE_API_BASE = "https://api.stripe.com/v1";

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return key;
}

function stripeHeaders(secretKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

function append(params: URLSearchParams, key: string, value: string | number | boolean | undefined) {
  if (value === undefined) return;
  params.append(key, String(value));
}

export async function createCheckoutSession(args: {
  origin: string;
  successPath?: string;
  cancelPath?: string;
}) {
  const secretKey = getStripeSecretKey();
  const priceId = process.env.STRIPE_PRICE_ID;
  const amountCents = Number(process.env.STRIPE_REPORT_AMOUNT_CENTS ?? 299);
  const currency = process.env.STRIPE_CURRENCY ?? "usd";
  const productName = process.env.STRIPE_PRODUCT_NAME ?? "Aurascan Full Report";

  const successPath = args.successPath ?? "/?checkout=success&session_id={CHECKOUT_SESSION_ID}";
  const cancelPath = args.cancelPath ?? "/?checkout=cancel";

  const params = new URLSearchParams();
  append(params, "mode", "payment");
  append(params, "success_url", `${args.origin}${successPath}`);
  append(params, "cancel_url", `${args.origin}${cancelPath}`);
  append(params, "allow_promotion_codes", false);
  append(params, "billing_address_collection", "auto");
  append(params, "payment_method_types[0]", "card");

  if (priceId) {
    append(params, "line_items[0][price]", priceId);
    append(params, "line_items[0][quantity]", 1);
  } else {
    append(params, "line_items[0][quantity]", 1);
    append(params, "line_items[0][price_data][currency]", currency);
    append(params, "line_items[0][price_data][unit_amount]", amountCents);
    append(params, "line_items[0][price_data][product_data][name]", productName);
  }

  const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
    method: "POST",
    headers: stripeHeaders(secretKey),
    body: params.toString(),
    signal: AbortSignal.timeout(15000),
  }).catch((error: unknown) => {
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
      throw new Error("Stripe checkout request timed out");
    }
    throw error;
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "Stripe checkout session creation failed");
  }

  return payload as {
    id: string;
    url: string;
    payment_status: string;
    status: string;
  };
}

export async function retrieveCheckoutSession(sessionId: string) {
  const secretKey = getStripeSecretKey();
  const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "Stripe session verification failed");
  }

  return payload as {
    id: string;
    payment_status: string;
    status: string;
    amount_total: number | null;
    currency: string | null;
  };
}
