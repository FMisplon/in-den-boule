import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { mainNav, site } from "@/lib/site-data";

type SiteShellProps = {
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteShell({
  children,
  ctaHref = "/reservatie",
  ctaLabel = "Reserveer je tafel"
}: SiteShellProps) {
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
        <div className="footer-block">
          <p>{site.name}</p>
          <p>{site.address}</p>
        </div>
        <div className="footer-block">
          <Link href="/privacy">Privacybeleid</Link>
        </div>
        <div className="footer-block footer-credit">
          <a href="mailto:frederik@glowth.be" aria-label="Website ontwerp en realisatie door Glowth">
            <Image
              src="/assets/images/glowth-logo-v2.png"
              alt="Glowth logo"
              width={140}
              height={56}
            />
            <span>Website ontwerp en realisatie door Glowth</span>
          </a>
        </div>
      </footer>
    </>
  );
}
