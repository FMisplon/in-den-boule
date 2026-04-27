import { createHash } from "node:crypto";

export const CHECK_IN_COOKIE_NAME = "boule_checkin_access";

export function createCheckInAccessToken(accessCode: string) {
  return createHash("sha256").update(`boule-checkin:${accessCode}`).digest("hex");
}

export function hasValidCheckInAccess(cookieValue: string | undefined, accessCode: string | undefined) {
  if (!accessCode) {
    return true;
  }

  if (!cookieValue) {
    return false;
  }

  return cookieValue === createCheckInAccessToken(accessCode);
}
