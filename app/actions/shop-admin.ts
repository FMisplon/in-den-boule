"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readString } from "@/lib/forms";
import { env } from "@/lib/env";
import {
  GIFT_CARD_ADMIN_COOKIE_NAME,
  createGiftCardAdminToken,
  hasValidGiftCardAdminAccess
} from "@/lib/gift-card-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ShopAdminState = {
  success: boolean;
  message: string;
  orderId?: string;
  adminStatus?: string;
  handledAt?: string | null;
  handledBy?: string | null;
  adminNote?: string | null;
};

export const idleShopAdminState: ShopAdminState = {
  success: false,
  message: ""
};

export async function unlockShopAdmin(
  _prevState: ShopAdminState,
  formData: FormData
): Promise<ShopAdminState> {
  const accessCode = readString(formData, "access_code");

  if (!env.giftCardAdminAccessCode) {
    redirect("/shop/admin");
  }

  if (!accessCode || accessCode !== env.giftCardAdminAccessCode) {
    return {
      success: false,
      message: "De admincode klopt niet."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(GIFT_CARD_ADMIN_COOKIE_NAME, createGiftCardAdminToken(accessCode), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.appUrl.startsWith("https://"),
    path: "/shop/admin",
    maxAge: 60 * 60 * 12
  });

  redirect("/shop/admin");
}

export async function updateShopOrderAdminState(
  _prevState: ShopAdminState,
  formData: FormData
): Promise<ShopAdminState> {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(GIFT_CARD_ADMIN_COOKIE_NAME)?.value;

  if (!hasValidGiftCardAdminAccess(accessCookie, env.giftCardAdminAccessCode)) {
    return {
      success: false,
      message: "Geen toegang tot de shop-admin.",
      orderId: readString(formData, "order_id")
    };
  }

  const orderId = readString(formData, "order_id");
  const adminStatus = readString(formData, "admin_status") || "new";
  const handledBy = readString(formData, "handled_by");
  const adminNote = readString(formData, "admin_note");

  if (!orderId) {
    return {
      success: false,
      message: "Bestelling ontbreekt."
    };
  }

  const handledAt = adminStatus === "new" ? null : new Date().toISOString();
  const supabase = createSupabaseServerClient();
  const { data: updatedOrder, error } = await supabase
    .from("gift_card_orders")
    .update({
      admin_status: adminStatus,
      handled_at: handledAt,
      handled_by: handledBy || null,
      admin_note: adminNote || null
    })
    .eq("id", orderId)
    .select("id,admin_status,handled_at,handled_by,admin_note")
    .maybeSingle();

  if (error || !updatedOrder) {
    return {
      success: false,
      message: "De shopbestelling kon niet bijgewerkt worden.",
      orderId
    };
  }

  revalidatePath("/shop/admin");
  return {
    success: true,
    message: "Shopbestelling bijgewerkt.",
    orderId: updatedOrder.id,
    adminStatus: updatedOrder.admin_status,
    handledAt: updatedOrder.handled_at,
    handledBy: updatedOrder.handled_by,
    adminNote: updatedOrder.admin_note
  };
}
