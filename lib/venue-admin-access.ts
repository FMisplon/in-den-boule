import { createHash } from "node:crypto";

export const VENUE_ADMIN_COOKIE_NAME = "boule_venue_admin";

export function createVenueAdminToken(accessCode: string) {
  return createHash("sha256").update(`boule-venue-admin:${accessCode}`).digest("hex");
}

export function hasValidVenueAdminAccess(
  cookieValue: string | undefined,
  accessCode: string | undefined
) {
  if (!accessCode) {
    return true;
  }

  if (!cookieValue) {
    return false;
  }

  return cookieValue === createVenueAdminToken(accessCode);
}
