import { createHash } from "node:crypto";

export const RESERVATION_ADMIN_COOKIE_NAME = "boule_reservation_admin";

export function createReservationAdminToken(accessCode: string) {
  return createHash("sha256").update(`boule-reservation-admin:${accessCode}`).digest("hex");
}

export function hasValidReservationAdminAccess(
  cookieValue: string | undefined,
  accessCode: string | undefined
) {
  if (!accessCode) {
    return true;
  }

  if (!cookieValue) {
    return false;
  }

  return cookieValue === createReservationAdminToken(accessCode);
}
