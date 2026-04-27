"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  GIFT_CARD_ADMIN_COOKIE_NAME,
  createGiftCardAdminToken,
  hasValidGiftCardAdminAccess
} from "@/lib/gift-card-access";
import { env } from "@/lib/env";
import { normalizeGiftCardInput, resolveGiftCardStatus } from "@/lib/gift-cards";
import { readString } from "@/lib/forms";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type GiftCardRedeemState = {
  success: boolean;
  message: string;
  resultStatus?: "valid" | "used" | "invalid" | "refunded";
  voucherCode?: string;
  recipientName?: string;
  amountLabel?: string;
  redeemedAt?: string;
};

export const idleGiftCardRedeemState: GiftCardRedeemState = {
  success: false,
  message: ""
};

export async function unlockGiftCardAdmin(
  _prevState: GiftCardRedeemState,
  formData: FormData
): Promise<GiftCardRedeemState> {
  const accessCode = readString(formData, "access_code");

  if (!env.giftCardAdminAccessCode) {
    redirect("/cadeaubonnen/redeem");
  }

  if (!accessCode || accessCode !== env.giftCardAdminAccessCode) {
    return {
      success: false,
      message: "De admincode klopt niet."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    GIFT_CARD_ADMIN_COOKIE_NAME,
    createGiftCardAdminToken(accessCode),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: env.appUrl.startsWith("https://"),
      path: "/cadeaubonnen/redeem",
      maxAge: 60 * 60 * 12
    }
  );

  redirect("/cadeaubonnen/redeem");
}

export async function redeemGiftCard(
  _prevState: GiftCardRedeemState,
  formData: FormData
): Promise<GiftCardRedeemState> {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(GIFT_CARD_ADMIN_COOKIE_NAME)?.value;

  if (!hasValidGiftCardAdminAccess(accessCookie, env.giftCardAdminAccessCode)) {
    return {
      success: false,
      message: "Geen toegang tot de cadeaubon-redeemtool."
    };
  }

  const rawValue = readString(formData, "voucher_value");
  const voucherCode = normalizeGiftCardInput(rawValue);
  const redeemedBy = readString(formData, "redeemed_by");
  const redeemNote = readString(formData, "redeem_note");

  if (!voucherCode) {
    return {
      success: false,
      message: "Scan of plak een geldige voucherlink of vouchercode."
    };
  }

  const supabase = createSupabaseServerClient();
  const { data: card, error: cardError } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("voucher_code", voucherCode)
    .maybeSingle();

  if (cardError || !card) {
    return {
      success: false,
      message: "Ongeldige cadeaubon. Deze code werd niet gevonden.",
      resultStatus: "invalid",
      voucherCode
    };
  }

  const { data: order } = await supabase
    .from("gift_card_orders")
    .select("status")
    .eq("id", card.order_id)
    .maybeSingle();

  const status = resolveGiftCardStatus(card, order?.status || "unknown");
  const amountLabel = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: card.currency
  }).format(card.amount_cents / 100);

  if (status === "refunded") {
    return {
      success: false,
      message: "Deze cadeaubon hoort bij een geannuleerde of terugbetaalde bestelling.",
      resultStatus: "refunded",
      voucherCode: card.voucher_code,
      recipientName: card.recipient_name,
      amountLabel
    };
  }

  if (status === "invalid") {
    return {
      success: false,
      message: "Deze cadeaubon is niet geldig voor redeem.",
      resultStatus: "invalid",
      voucherCode: card.voucher_code,
      recipientName: card.recipient_name,
      amountLabel
    };
  }

  if (status === "used") {
    return {
      success: false,
      message: "Deze cadeaubon werd al eerder ingeruild.",
      resultStatus: "used",
      voucherCode: card.voucher_code,
      recipientName: card.recipient_name,
      amountLabel,
      redeemedAt: card.redeemed_at || undefined
    };
  }

  const redeemedAt = new Date().toISOString();
  const { data: updatedCard, error: updateError } = await supabase
    .from("gift_cards")
    .update({
      redeemed_at: redeemedAt,
      redeemed_by: redeemedBy || null,
      redeem_note: redeemNote || null
    })
    .eq("id", card.id)
    .is("redeemed_at", null)
    .select("*")
    .maybeSingle();

  if (updateError) {
    return {
      success: false,
      message: "Redeem kon niet opgeslagen worden. Probeer opnieuw.",
      resultStatus: "invalid",
      voucherCode: card.voucher_code,
      recipientName: card.recipient_name,
      amountLabel
    };
  }

  if (!updatedCard) {
    const { data: latestCard } = await supabase
      .from("gift_cards")
      .select("redeemed_at")
      .eq("id", card.id)
      .maybeSingle();

    return {
      success: false,
      message: "Deze cadeaubon werd intussen al ingeruild.",
      resultStatus: "used",
      voucherCode: card.voucher_code,
      recipientName: card.recipient_name,
      amountLabel,
      redeemedAt: latestCard?.redeemed_at || undefined
    };
  }

  return {
    success: true,
    message: "Cadeaubon geldig. Redeem geregistreerd.",
    resultStatus: "valid",
    voucherCode: updatedCard.voucher_code,
    recipientName: updatedCard.recipient_name,
    amountLabel,
    redeemedAt: updatedCard.redeemed_at || undefined
  };
}
