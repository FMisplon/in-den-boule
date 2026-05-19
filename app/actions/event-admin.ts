"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readString } from "@/lib/forms";
import { env } from "@/lib/env";
import {
  EVENT_ADMIN_COOKIE_NAME,
  createEventAdminToken,
  hasValidEventAdminAccess
} from "@/lib/event-admin-access";

export type EventAdminAccessState = {
  success: boolean;
  message: string;
};

export async function unlockEventAdmin(
  _prevState: EventAdminAccessState,
  formData: FormData
): Promise<EventAdminAccessState> {
  const accessCode = readString(formData, "access_code");

  if (!env.reservationAdminAccessCode) {
    redirect("/events/admin");
  }

  if (!accessCode || accessCode !== env.reservationAdminAccessCode) {
    return {
      success: false,
      message: "De admincode klopt niet."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(EVENT_ADMIN_COOKIE_NAME, createEventAdminToken(accessCode), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.appUrl.startsWith("https://"),
    path: "/events/admin",
    maxAge: 60 * 60 * 12
  });

  redirect("/events/admin");
}

export async function canAccessEventAdmin() {
  const cookieStore = await cookies();
  return hasValidEventAdminAccess(
    cookieStore.get(EVENT_ADMIN_COOKIE_NAME)?.value,
    env.reservationAdminAccessCode
  );
}
