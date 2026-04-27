import { randomBytes } from "node:crypto";
import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { env } from "@/lib/env";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

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

function createVoucherCode() {
  const raw = randomBytes(6).toString("hex").toUpperCase();
  return `BOULE-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

export function buildGiftCardUrl(voucherCode: string) {
  return `${env.appUrl.replace(/\/$/, "")}/cadeaubonnen/${voucherCode}`;
}

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

export async function ensureGiftCardIssued(
  supabase: SupabaseServerClient,
  order: GiftCardOrderRecord
) {
  if (order.status !== "paid") {
    return null as GiftCardRecord | null;
  }

  const { data: existingCard, error: existingError } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("order_id", order.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Cadeaubon ophalen mislukt: ${existingError.message}`);
  }

  if (existingCard) {
    return existingCard as GiftCardRecord;
  }

  const voucherCode = createVoucherCode();
  const insert = {
    order_id: order.id,
    voucher_code: voucherCode,
    purchaser_name: order.purchaser_name,
    purchaser_email: order.purchaser_email,
    recipient_name: order.recipient_name,
    recipient_email: order.recipient_email || null,
    personal_message: order.personal_message || null,
    amount_cents: order.amount_cents,
    currency: order.currency,
    fulfillment_mode: order.fulfillment_mode,
    pickup_in_store: order.pickup_in_store,
    qr_payload: buildGiftCardUrl(voucherCode),
    status: "active"
  };

  const { data: insertedCard, error: insertError } = await supabase
    .from("gift_cards")
    .insert(insert)
    .select("*")
    .single();

  if (insertError || !insertedCard) {
    throw new Error(`Cadeaubon aanmaken mislukt: ${insertError?.message || "onbekende fout"}`);
  }

  if (!order.voucher_issued_at) {
    await supabase
      .from("gift_card_orders")
      .update({ voucher_issued_at: new Date().toISOString() })
      .eq("id", order.id);
  }

  return insertedCard as GiftCardRecord;
}

export async function generateGiftCardPdf(card: GiftCardRecord) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const titleFont = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const bodyBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 28,
    y: 28,
    width: 539,
    height: 786,
    color: rgb(0.97, 0.93, 0.84)
  });

  page.drawRectangle({
    x: 44,
    y: 44,
    width: 507,
    height: 754,
    borderWidth: 2,
    borderColor: rgb(0.12, 0.35, 0.18),
    color: rgb(1, 0.99, 0.96)
  });

  page.drawText("In den Boule", {
    x: 60,
    y: 744,
    size: 28,
    font: titleFont,
    color: rgb(0.12, 0.35, 0.18)
  });

  page.drawText("Digitale cadeaubon", {
    x: 60,
    y: 706,
    size: 16,
    font: bodyBold,
    color: rgb(0.4, 0.22, 0.13)
  });

  const amountLabel = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: card.currency
  }).format(card.amount_cents / 100);

  page.drawText(amountLabel, {
    x: 60,
    y: 650,
    size: 34,
    font: bodyBold,
    color: rgb(0.88, 0.46, 0.02)
  });

  page.drawText(`Voor: ${card.recipient_name}`, {
    x: 60,
    y: 604,
    size: 15,
    font: bodyFont,
    color: rgb(0.15, 0.12, 0.1)
  });

  page.drawText(`Code: ${card.voucher_code}`, {
    x: 60,
    y: 576,
    size: 14,
    font: bodyBold,
    color: rgb(0.15, 0.12, 0.1)
  });

  if (card.personal_message) {
    page.drawText("Persoonlijke boodschap", {
      x: 60,
      y: 528,
      size: 14,
      font: bodyBold,
      color: rgb(0.4, 0.22, 0.13)
    });

    const messageLines = card.personal_message.slice(0, 220).split("\n");
    let currentY = 504;
    for (const line of messageLines.slice(0, 6)) {
      page.drawText(line, {
        x: 60,
        y: currentY,
        size: 12,
        font: bodyFont,
        color: rgb(0.15, 0.12, 0.1)
      });
      currentY -= 18;
    }
  }

  const qrDataUrl = await QRCode.toDataURL(card.qr_payload, {
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#1F5A2D",
      light: "#FFFFFF"
    },
    width: 500
  });

  const qrBase64 = qrDataUrl.split(",")[1] || "";
  const qrImage = await pdf.embedPng(Buffer.from(qrBase64, "base64"));
  page.drawImage(qrImage, {
    x: 360,
    y: 470,
    width: 150,
    height: 150
  });

  page.drawText("Scan of open de voucher online", {
    x: 344,
    y: 446,
    size: 11,
    font: bodyFont,
    color: rgb(0.15, 0.12, 0.1)
  });

  page.drawText("Inwisselbaar in Café In den Boule.", {
    x: 60,
    y: 166,
    size: 12,
    font: bodyBold,
    color: rgb(0.15, 0.12, 0.1)
  });
  page.drawText("Augustijnenstraat 2, 3000 Leuven", {
    x: 60,
    y: 146,
    size: 12,
    font: bodyFont,
    color: rgb(0.15, 0.12, 0.1)
  });
  page.drawText("Toon deze PDF of de online voucher bij redeem.", {
    x: 60,
    y: 126,
    size: 12,
    font: bodyFont,
    color: rgb(0.15, 0.12, 0.1)
  });

  return Buffer.from(await pdf.save());
}
