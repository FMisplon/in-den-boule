"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyGoogleConsent,
  ensureDataLayer,
  getStoredCookieConsent,
  persistCookieConsent,
  pushGtagCommand,
  setRuntimeCookieConsent,
  type CookieConsent
} from "@/lib/tracking";

type CookieConsentManagerProps = {
  gtmContainerId?: string;
};

const defaultConsent: CookieConsent = {
  analytics: false,
  marketing: false
};

function loadGtmContainer(containerId: string) {
  if (typeof window === "undefined" || window.__bouleGtmLoaded) {
    return;
  }

  ensureDataLayer();
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js"
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  document.head.appendChild(script);
  window.__bouleGtmLoaded = true;
}

export function CookieConsentManager({ gtmContainerId }: CookieConsentManagerProps) {
  const [savedConsent, setSavedConsent] = useState<CookieConsent | null>(null);
  const [isBannerVisible, setBannerVisible] = useState(false);
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);
  const [draftConsent, setDraftConsent] = useState<CookieConsent>(defaultConsent);

  const hasTracking = useMemo(
    () => Boolean(gtmContainerId && /^GTM-[A-Z0-9]+$/.test(gtmContainerId)),
    [gtmContainerId]
  );

  useEffect(() => {
    const stored = getStoredCookieConsent();

    if (!hasTracking) {
      setRuntimeCookieConsent(defaultConsent);
      setSavedConsent(defaultConsent);
      setBannerVisible(false);
      return;
    }

    if (!stored) {
      setRuntimeCookieConsent(defaultConsent);
      setSavedConsent(null);
      setDraftConsent(defaultConsent);
      setBannerVisible(true);
      return;
    }

    setRuntimeCookieConsent(stored);
    setSavedConsent(stored);
    setDraftConsent(stored);

    if (stored.analytics || stored.marketing) {
      ensureDataLayer();
      pushGtagCommand("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        functionality_storage: "granted",
        security_storage: "granted",
        personalization_storage: "denied",
        wait_for_update: 500
      });
      applyGoogleConsent(stored);
      loadGtmContainer(gtmContainerId!);
    }
  }, [gtmContainerId, hasTracking]);

  useEffect(() => {
    function openPreferences() {
      if (!hasTracking) {
        return;
      }

      setPreferencesOpen(true);
      setBannerVisible(true);
    }

    window.addEventListener("boule:open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("boule:open-cookie-preferences", openPreferences);
  }, [hasTracking]);

  if (!hasTracking || (!isBannerVisible && !isPreferencesOpen)) {
    return null;
  }

  function saveConsent(nextConsent: CookieConsent) {
    persistCookieConsent(nextConsent);
    setSavedConsent(nextConsent);
    setDraftConsent(nextConsent);
    setBannerVisible(false);
    setPreferencesOpen(false);

    ensureDataLayer();
    pushGtagCommand("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
      personalization_storage: "denied",
      wait_for_update: 500
    });
    applyGoogleConsent(nextConsent);

    if (nextConsent.analytics || nextConsent.marketing) {
      loadGtmContainer(gtmContainerId!);
    }
  }

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie-instellingen">
      <div className="cookie-banner-copy">
        <p className="cookie-banner-eyebrow">Cookies & meting</p>
        <h2>We gebruiken alleen analytics en marketingtags als je daarvoor kiest.</h2>
        <p>
          Functionele cookies blijven actief voor beveiliging en werking van de site. Google Tag
          Manager en GA4 worden pas geladen na toestemming. Je keuze kun je later altijd aanpassen
          via de cookie-instellingen.
        </p>
      </div>

      <div className="cookie-banner-actions">
        <button className="button button-secondary" type="button" onClick={() => setPreferencesOpen((value) => !value)}>
          {isPreferencesOpen ? "Verberg opties" : "Pas voorkeuren aan"}
        </button>
        <button className="button button-secondary" type="button" onClick={() => saveConsent(defaultConsent)}>
          Weiger optionele cookies
        </button>
        <button
          className="button"
          type="button"
          onClick={() =>
            saveConsent({
              analytics: true,
              marketing: true
            })
          }
        >
          Accepteer alles
        </button>
      </div>

      {isPreferencesOpen ? (
        <div className="cookie-banner-preferences">
          <div className="cookie-toggle-row">
            <div>
              <strong>Noodzakelijke cookies</strong>
              <p>Altijd actief voor beveiliging, formulierwerking en technische sessies.</p>
            </div>
            <span className="cookie-toggle-static">Altijd aan</span>
          </div>

          <label className="cookie-toggle-row">
            <div>
              <strong>Analytics</strong>
              <p>
                Laat GTM en GA4 toe om pageviews en basisconversies zoals reservaties,
                nieuwsbriefinschrijvingen, tickets en cadeaubonnen te meten.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draftConsent.analytics}
              onChange={(event) =>
                setDraftConsent((current) => ({
                  ...current,
                  analytics: event.target.checked
                }))
              }
            />
          </label>

          <label className="cookie-toggle-row">
            <div>
              <strong>Marketing</strong>
              <p>
                Voor later gebruik met Google Ads, Meta of andere advertentieplatformen via GTM.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draftConsent.marketing}
              onChange={(event) =>
                setDraftConsent((current) => ({
                  ...current,
                  marketing: event.target.checked
                }))
              }
            />
          </label>

          <div className="cookie-banner-save">
            <button className="button" type="button" onClick={() => saveConsent(draftConsent)}>
              Bewaar voorkeuren
            </button>
          </div>
        </div>
      ) : null}

      {savedConsent ? (
        <p className="cookie-banner-meta">
          Huidige keuze: analytics {savedConsent.analytics ? "aan" : "uit"} · marketing{" "}
          {savedConsent.marketing ? "aan" : "uit"}
        </p>
      ) : null}
    </div>
  );
}
