import Link from "next/link";
import { headers } from "next/headers";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
type AdminLink = {
  title: string;
  description: string;
  href: string;
  kind: "internal" | "external";
  label: string;
  note?: string;
};

type AdminSection = {
  eyebrow: string;
  title: string;
  intro: string;
  links: AdminLink[];
};

const adminSections: AdminSection[] = [
  {
    eyebrow: "Content",
    title: "Beheer content en structuur",
    intro:
      "Voor pagina-inhoud, menu-updates, events en globale site-instellingen werk je vanuit Sanity. De Studio draait apart van deze website.",
    links: [
      {
        title: "Sanity Studio",
        description:
          "Open rechtstreeks de aparte Sanity Studio voor menu, homepage, events, verhuur en site-instellingen.",
        href: "https://www.sanity.io/@olJSoAcrF/studio/ikm5rj7pre98z4szkxyoby4d/default/structure",
        kind: "external",
        label: "Open Sanity",
        note: "Login vereist"
      },
      {
        title: "Studio-info in deze site",
        description:
          "Interne infopagina met uitleg over hoe de Sanity Studio voor In den Boule apart gehost wordt en hoe je schemawijzigingen deployt.",
        href: "/studio",
        kind: "internal",
        label: "Open info"
      }
    ]
  },
  {
    eyebrow: "Verkoop",
    title: "Volg reservaties, betalingen en cadeaubonnen op",
    intro:
      "Hier zitten de tools voor dagelijkse opvolging van reservaties, webshopbestellingen, Mollie-betalingen en cadeaubonnen.",
    links: [
      {
        title: "Reservatie admin",
        description:
          "Bekijk nieuwe aanvragen, bevestig reservaties en houd interne opvolgnotities bij.",
        href: "/reservaties/admin",
        kind: "internal",
        label: "Open reservaties"
      },
      {
        title: "Shop admin",
        description:
          "Volg cadeaubonbestellingen op en beheer de interne status van webshoporders.",
        href: "/shop/admin",
        kind: "internal",
        label: "Open shop admin"
      },
      {
        title: "Mollie dashboard",
        description:
          "Controleer betalingen, refunds en betaalstatussen rechtstreeks in Mollie.",
        href: "https://my.mollie.com/dashboard/login?lang=nl",
        kind: "external",
        label: "Open Mollie",
        note: "Login vereist"
      },
      {
        title: "Cadeaubon redeem",
        description:
          "Controleer en verzilver cadeaubonnen aan de kassa of tijdens service.",
        href: "/cadeaubonnen/redeem",
        kind: "internal",
        label: "Open redeemtool"
      }
    ]
  },
  {
    eyebrow: "Staff",
    title: "Operationele tools voor events en service",
    intro:
      "Gebruik deze tools aan de deur of intern tijdens events en serviceblokken. Beveiligde tools vragen hun eigen staff- of admincode.",
    links: [
      {
        title: "Ticket check-in",
        description:
          "Scan of controleer tickets aan de deur en blokkeer dubbele check-ins.",
        href: "/check-in",
        kind: "internal",
        label: "Open check-in",
        note: "Interne staffcode vereist"
      }
    ]
  }
];

function AdminHubLink({ link }: { link: AdminLink }) {
  const content = (
    <>
      <div className="editor-hub-card-topline">
        <div>
          <h3>{link.title}</h3>
          {link.note ? <p className="editor-hub-card-note">{link.note}</p> : null}
        </div>
        <span className="editor-hub-card-kind">
          {link.kind === "external" ? "Extern" : "Intern"}
        </span>
      </div>
      <p>{link.description}</p>
      <span className="button button-secondary editor-hub-card-button">{link.label}</span>
    </>
  );

  if (link.kind === "external") {
    return (
      <a
        className="editor-hub-card"
        href={link.href}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className="editor-hub-card" href={link.href}>
      {content}
    </Link>
  );
}

export default async function AdminPage() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "onbekende host";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  const currentOrigin = `${protocol}://${host}`;

  return (
    <SiteShell ctaHref="/reservatie" ctaLabel="Terug naar de site">
      <PageHero
        eyebrow="Editor hub"
        title="Startpunt voor editors en intern beheer."
        intro="Gebruik deze pagina als centrale ingang naar contentbeheer, betalingsopvolging, reservaties en interne stafftools."
      />

      <section className="section venue-section editor-hub-section">
        <div className="editor-hub-stack">
          <div className="contact-band contact-band-page editor-hub-band">
            <div>
              <p className="eyebrow">Omgeving</p>
              <h2>Je werkt momenteel op {host}</h2>
            </div>
            <p className="editor-hub-band-copy">
              Interne tools gebruiken relatieve links, dus deze startpagina blijft werken wanneer
              de site verhuist naar <strong>indenboule.be</strong>. Huidige origin:{" "}
              <span>{currentOrigin}</span>
            </p>
          </div>
          {adminSections.map((section) => (
            <article key={section.title} className="venue-panel editor-hub-panel">
              <div className="editor-hub-panel-copy">
                <p className="eyebrow">{section.eyebrow}</p>
                <h2>{section.title}</h2>
                <p>{section.intro}</p>
              </div>
              <div className="editor-hub-grid">
                {section.links.map((link) => (
                  <AdminHubLink key={link.title} link={link} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
