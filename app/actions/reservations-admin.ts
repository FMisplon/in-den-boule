"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readString } from "@/lib/forms";
import { env } from "@/lib/env";
import {
  RESERVATION_ADMIN_COOKIE_NAME,
  createReservationAdminToken,
  hasValidReservationAdminAccess
} from "@/lib/reservation-admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ReservationAdminState = {
  success: boolean;
  message: string;
  reservationId?: string;
  status?: string;
  handledAt?: string | null;
  handledBy?: string | null;
  adminNote?: string | null;
};

export async function unlockReservationAdmin(
  _prevState: ReservationAdminState,
  formData: FormData
): Promise<ReservationAdminState> {
  const accessCode = readString(formData, "access_code");

  if (!env.reservationAdminAccessCode) {
    redirect("/reservaties/admin");
  }

  if (!accessCode || accessCode !== env.reservationAdminAccessCode) {
    return {
      success: false,
      message: "De admincode klopt niet."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    RESERVATION_ADMIN_COOKIE_NAME,
    createReservationAdminToken(accessCode),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: env.appUrl.startsWith("https://"),
      path: "/reservaties/admin",
      maxAge: 60 * 60 * 12
    }
  );

  redirect("/reservaties/admin");
}

export async function updateReservationAdminState(
  _prevState: ReservationAdminState,
  formData: FormData
): Promise<ReservationAdminState> {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(RESERVATION_ADMIN_COOKIE_NAME)?.value;

  if (!hasValidReservationAdminAccess(accessCookie, env.reservationAdminAccessCode)) {
    return {
      success: false,
      message: "Geen toegang tot de reservatie-admin.",
      reservationId: readString(formData, "reservation_id")
    };
  }

  const reservationId = readString(formData, "reservation_id");
  const status = readString(formData, "status") || "new";
  const handledBy = readString(formData, "handled_by");
  const adminNote = readString(formData, "admin_note");

  if (!reservationId) {
    return {
      success: false,
      message: "Reservatie ontbreekt."
    };
  }

  const handledAt = status === "new" ? null : new Date().toISOString();
  const supabase = createSupabaseServerClient();
  const { data: updatedReservation, error } = await supabase
    .from("reservation_requests")
    .update({
      status,
      handled_at: handledAt,
      handled_by: handledBy || null,
      admin_note: adminNote || null
    })
    .eq("id", reservationId)
    .select("id,status,handled_at,handled_by,admin_note")
    .maybeSingle();

  if (error || !updatedReservation) {
    return {
      success: false,
      message: "De reservatie kon niet bijgewerkt worden.",
      reservationId
    };
  }

  revalidatePath("/reservaties/admin");
  return {
    success: true,
    message: "Reservatie bijgewerkt.",
    reservationId: updatedReservation.id,
    status: updatedReservation.status,
    handledAt: updatedReservation.handled_at,
    handledBy: updatedReservation.handled_by,
    adminNote: updatedReservation.admin_note
  };
}
