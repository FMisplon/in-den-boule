"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/site-data";

type SiteHeaderProps = {
  siteName: string;
  headerLine: string;
  ctaHref: string;
  ctaLabel: string;
  navItems: NavItem[];
};

const MOBILE_PRIMARY_NAV: NavItem[] = [
  { href: "/reservatie", label: "Reservatie" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" }
];

const MOBILE_SECONDARY_NAV: NavItem[] = [
  { href: "/shop", label: "Shop" },
  { href: "/verhuur", label: "Verhuur" }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function MobileMenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className={`mobile-menu-icon ${isOpen ? "is-open" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function SiteHeader({
  siteName,
  headerLine,
  ctaHref,
  ctaLabel,
  navItems
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 981px)");
    const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    handleViewportChange(mediaQuery);

    const listener = (event: MediaQueryListEvent) => handleViewportChange(event);
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  return (
    <header className={`site-header ${isMobileMenuOpen ? "is-mobile-open" : ""}`}>
      <div className="site-header-bar">
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
            <strong>{siteName}</strong>
            <small>{headerLine}</small>
          </span>
        </Link>

        <nav className="site-nav site-nav-desktop" aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActivePath(pathname, item.href) ? "is-active" : undefined}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button button-nav" href={ctaHref}>
            {ctaLabel}
          </Link>
        </nav>

        <div className="site-nav-mobile-actions">
          <Link className="button button-nav mobile-reserve-button" href="/reservatie">
            Reserveer
          </Link>
          <button
            type="button"
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "is-open" : ""}`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-nav"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span>Menu</span>
            <MobileMenuIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>
      </div>

      <div
        id="mobile-site-nav"
        className={`mobile-nav-panel ${isMobileMenuOpen ? "is-open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-nav-group">
          {MOBILE_PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActivePath(pathname, item.href) ? "is-active" : undefined}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mobile-nav-divider" />
        <div className="mobile-nav-group mobile-nav-group-secondary">
          {MOBILE_SECONDARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActivePath(pathname, item.href) ? "is-active" : undefined}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
