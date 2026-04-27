import { env } from "@/lib/env";

type MollieAmount = {
  currency: "EUR";
  value: string;
};

type MolliePayment = {
  id: string;
  status: string;
  _links?: {
    checkout?: { href: string };
  };
};

function requireMollieApiKey() {
  if (!env.mollieApiKey) {
    throw new Error("Missing MOLLIE_API_KEY");
  }

  return env.mollieApiKey;
}

export async function createMolliePayment(input: {
  amount: MollieAmount;
  description: string;
  redirectUrl: string;
  metadata: Record<string, string>;
}) {
  const apiKey = requireMollieApiKey();
  const response = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Mollie payment creation failed with status ${response.status}`);
  }

  return (await response.json()) as MolliePayment;
}

export async function getMolliePayment(paymentId: string) {
  const apiKey = requireMollieApiKey();
  const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Mollie payment fetch failed with status ${response.status}`);
  }

  return (await response.json()) as MolliePayment;
}
