export type GiftCardOrderRecord = {
  id: string;
  purchaser_name: string;
  purchaser_email: string;
  recipient_name: string;
  recipient_email?: string | null;
  personal_message?: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  fulfillment_mode: "self" | "send";
  pickup_in_store: boolean;
  voucher_issued_at?: string | null;
  fulfillment_sent_at?: string | null;
};

export type GiftCardRecord = {
  id: string;
  order_id: string;
  voucher_code: string;
  purchaser_name: string;
  purchaser_email: string;
  recipient_name: string;
  recipient_email?: string | null;
  personal_message?: string | null;
  amount_cents: number;
  currency: string;
  fulfillment_mode: "self" | "send";
  pickup_in_store: boolean;
  qr_payload: string;
  status: string;
  redeemed_at?: string | null;
  redeemed_by?: string | null;
  redeem_note?: string | null;
};

export function normalizeGiftCardInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const segments = parsed.pathname.split("/").filter(Boolean);
      const maybeCode = segments.at(-1);
      return maybeCode?.trim() || "";
    } catch {
      return trimmed;
    }
  }

  return trimmed.replace(/^\/?cadeaubonnen\//, "").trim();
}

export function resolveGiftCardStatus(card: GiftCardRecord, orderStatus: string) {
  if (card.status !== "active") {
    return "invalid" as const;
  }

  if (["refunded", "charged_back", "canceled", "expired", "failed"].includes(orderStatus)) {
    return "refunded" as const;
  }

  if (orderStatus !== "paid") {
    return "invalid" as const;
  }

  if (card.redeemed_at) {
    return "used" as const;
  }

  return "valid" as const;
}
