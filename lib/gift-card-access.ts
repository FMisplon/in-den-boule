import { createHash } from "node:crypto";

export const GIFT_CARD_ADMIN_COOKIE_NAME = "boule_gift_card_admin";

export function createGiftCardAdminToken(accessCode: string) {
  return createHash("sha256").update(`boule-gift-card-admin:${accessCode}`).digest("hex");
}

export function hasValidGiftCardAdminAccess(
  cookieValue: string | undefined,
  accessCode: string | undefined
) {
  if (!accessCode) {
    return true;
  }

  if (!cookieValue) {
    return false;
  }

  return cookieValue === createGiftCardAdminToken(accessCode);
}
