import { createHash } from "crypto";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export function getEventAccessCookieName(slug: string) {
  return `event-access-${normalizeSlug(slug)}`;
}

export function createEventAccessToken(slug: string, password: string) {
  return createHash("sha256")
    .update(`${normalizeSlug(slug)}:${password}`)
    .digest("hex");
}
