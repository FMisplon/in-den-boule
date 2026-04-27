"use client";

export type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_STORAGE_KEY = "boule_cookie_consent_v1";
export const COOKIE_CONSENT_COOKIE_KEY = "boule_cookie_consent_v1";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[]>;
    __bouleConsent?: CookieConsent;
    __bouleGtmLoaded?: boolean;
  }
}

export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CookieConsent>;

    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true
    };
  } catch {
    return null;
  }
}

export function persistCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(consent);
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, serialized);
  document.cookie = `${COOKIE_CONSENT_COOKIE_KEY}=${encodeURIComponent(
    serialized
  )}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.__bouleConsent = consent;
}

export function setRuntimeCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") {
    return;
  }

  window.__bouleConsent = consent;
}

export function ensureDataLayer() {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
}

export function pushGtagCommand(command: string, action: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  ensureDataLayer();
  window.dataLayer.push([command, action, params]);
}

export function applyGoogleConsent(consent: CookieConsent) {
  pushGtagCommand("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    personalization_storage: consent.marketing ? "granted" : "denied"
  });
}

export function shouldTrackAnalytics() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.__bouleConsent?.analytics === true;
}

export function trackDataLayerEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !shouldTrackAnalytics()) {
    return false;
  }

  ensureDataLayer();
  window.dataLayer.push({
    event,
    ...payload
  });

  return true;
}
