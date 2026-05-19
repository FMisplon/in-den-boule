import { createHash } from "node:crypto";

export const EVENT_ADMIN_COOKIE_NAME = "boule_event_admin";

export function createEventAdminToken(accessCode: string) {
  return createHash("sha256").update(`boule-event-admin:${accessCode}`).digest("hex");
}

export function hasValidEventAdminAccess(
  cookieValue: string | undefined,
  accessCode: string | undefined
) {
  if (!accessCode) {
    return true;
  }

  if (!cookieValue) {
    return false;
  }

  return cookieValue === createEventAdminToken(accessCode);
}
