import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { CookiePreferencesButton } from "@/components/cookie-preferences-button";
import { getSiteSettings } from "@/lib/sanity/loaders";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { mainNav } from "@/lib/site-data";

type SiteShellProps = {
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
};

function SocialIcon({ platform }: { platform: string }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" {...commonProps} />
          <circle cx="12" cy="12" r="4" {...commonProps} />
          <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 20v-6h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H16.8V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3V11H7.5v3h2.7v6h3.3Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.7 4.5c.6 1.7 1.8 3 3.6 3.6v2.7c-1.3 0-2.5-.4-3.6-1.1v5.6a4.8 4.8 0 1 1-4.8-4.8c.3 0 .7 0 1 .1V13a2.1 2.1 0 1 0 1.1 1.9V4.5h2.7Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="9" width="3.2" height="11" fill="currentColor" stroke="none" />
          <circle cx="5.6" cy="5.8" r="1.8" fill="currentColor" stroke="none" />
          <path d="M10 9h3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 4.4 1.9 4.4 5.1V20h-3.2v-5.4c0-1.6-.6-2.7-2.1-2.7-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V20H10V9Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.6 8.2a2.8 2.8 0 0 0-2-2C16.8 5.7 12 5.7 12 5.7s-4.8 0-6.6.5a2.8 2.8 0 0 0-2 2A28 28 0 0 0 3 12a28 28 0 0 0 .4 3.8 2.8 2.8 0 0 0 2 2c1.8.5 6.6.5 6.6.5s4.8 0 6.6-.5a2.8 2.8 0 0 0 2-2A28 28 0 0 0 21 12a28 28 0 0 0-.4-3.8ZM10.2 15.2V8.8l5.2 3.2-5.2 3.2Z" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export async function SiteShell({
  children,
  ctaHref = "/reservatie",
  ctaLabel = "Reserveer je tafel"
}: SiteShellProps) {
  const site = await getSiteSettings();
  const socialProfiles = site.socialProfiles || [];

  return (
    <>
      <div className="page-shell">
        <header className="site-header">
          <Link className="brand" href="/" aria-label="In den Boule home">
            <span className="brand-mark">
              <Image
                src="/assets/images/logo-boule-transparent.png"
                alt="Boule logo"
                width={160}
                height={96}
              />
            </span>
            <span className="brand-copy">
              <strong>{site.name}</strong>
              <small>{site.headerLine}</small>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Hoofdnavigatie">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="button button-nav" href={ctaHref}>
              {ctaLabel}
            </Link>
          </nav>
        </header>

        <main>{children}</main>
      </div>

      <footer className="site-footer site-footer-home">
        <div className="footer-block footer-newsletter">
          <NewsletterSignupForm />
        </div>
        {socialProfiles.length ? (
          <div className="footer-block footer-socials">
            <p className="footer-heading">Volg ons op</p>
            <div className="footer-socials-row">
              {socialProfiles.map((profile) => (
                <a
                  key={`${profile.platform}-${profile.url}`}
                  className="footer-social-link"
                  href={profile.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={profile.label}
                  title={profile.label}
                >
                  <SocialIcon platform={profile.platform} />
                  <span>{profile.label}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
        <div className="footer-block footer-legal">
          <p className="footer-heading">Wettelijk</p>
          <div className="footer-link-list">
            <Link href="/privacy">Privacybeleid</Link>
            <Link href="/cookiebeleid">Cookiebeleid</Link>
            <CookiePreferencesButton className="footer-link-button" />
            <Link href="/algemene-voorwaarden">Algemene voorwaarden</Link>
          </div>
        </div>
        <div className="footer-block footer-credit">
          <p className="footer-heading">Design &amp; development</p>
          <a
            href="https://glowth.be"
            target="_blank"
            rel="noreferrer"
            aria-label="Glowth"
          >
            <Image
              src="/assets/images/LogoTrans.svg"
              alt="Glowth logo"
              width={220}
              height={128}
            />
          </a>
        </div>
      </footer>
    </>
  );
}
