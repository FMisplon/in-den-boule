"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readString } from "@/lib/forms";
import { env } from "@/lib/env";
import { getReservationAdminCode } from "@/lib/internal-admin-access";
import {
  VENUE_ADMIN_COOKIE_NAME,
  createVenueAdminToken,
  hasValidVenueAdminAccess
} from "@/lib/venue-admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type VenueAdminState = {
  success: boolean;
  message: string;
  inquiryId?: string;
  status?: string;
  handledAt?: string | null;
  handledBy?: string | null;
  adminNote?: string | null;
};

export async function unlockVenueAdmin(
  _prevState: VenueAdminState,
  formData: FormData
): Promise<VenueAdminState> {
  const accessCode = readString(formData, "access_code");
  const adminCode = getReservationAdminCode();

  if (!adminCode) {
    redirect("/verhuur/admin");
  }

  if (!accessCode || accessCode !== adminCode) {
    return {
      success: false,
      message: "De admincode klopt niet."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    VENUE_ADMIN_COOKIE_NAME,
    createVenueAdminToken(accessCode),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: env.appUrl.startsWith("https://"),
      path: "/verhuur/admin",
      maxAge: 60 * 60 * 12
    }
  );

  redirect("/verhuur/admin");
}

export async function updateVenueAdminState(
  _prevState: VenueAdminState,
  formData: FormData
): Promise<VenueAdminState> {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(VENUE_ADMIN_COOKIE_NAME)?.value;
  const adminCode = getReservationAdminCode();

  if (!hasValidVenueAdminAccess(accessCookie, adminCode)) {
    return {
      success: false,
      message: "Geen toegang tot de verhuur-admin.",
      inquiryId: readString(formData, "inquiry_id")
    };
  }

  const inquiryId = readString(formData, "inquiry_id");
  const status = readString(formData, "status") || "new";
  const handledBy = readString(formData, "handled_by");
  const adminNote = readString(formData, "admin_note");

  if (!inquiryId) {
    return {
      success: false,
      message: "Aanvraag ontbreekt."
    };
  }

  const handledAt = status === "new" ? null : new Date().toISOString();
  const supabase = createSupabaseServerClient();
  const { data: updatedInquiry, error } = await supabase
    .from("venue_requests")
    .update({
      status,
      handled_at: handledAt,
      handled_by: handledBy || null,
      admin_note: adminNote || null
    })
    .eq("id", inquiryId)
    .select("id,status,handled_at,handled_by,admin_note")
    .maybeSingle();

  if (error || !updatedInquiry) {
    return {
      success: false,
      message: "De offerteaanvraag kon niet bijgewerkt worden.",
      inquiryId
    };
  }

  revalidatePath("/verhuur/admin");
  return {
    success: true,
    message: "Offerteaanvraag bijgewerkt.",
    inquiryId: updatedInquiry.id,
    status: updatedInquiry.status,
    handledAt: updatedInquiry.handled_at,
    handledBy: updatedInquiry.handled_by,
    adminNote: updatedInquiry.admin_note
  };
}
