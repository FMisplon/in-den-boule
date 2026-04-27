import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPageHeroImage, getSiteSettings } from "@/lib/sanity/loaders";

export const revalidate = 60;

export default async function ContactPage() {
  const site = await getSiteSettings();
  const heroImage = await getPageHeroImage("contact");

  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title="Voor vragen, groepen, cadeaubonnen of verhuur."
        intro="Alle praktische info en de belangrijkste contactpaden zitten hier samen op een duidelijke plek, zonder extra ruis op de homepage."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="contact-band contact-band-page">
        <div>
          <p className="eyebrow">Praktisch</p>
          <h2>
            {site.address} · keuken altijd doorlopend open.
          </h2>
        </div>
      </section>

      <section className="section contact-section">
        <div className="contact-layout">
          <ContactForm />
          <aside className="contact-side">
            <article className="contact-map-card">
              <div className="contact-map-copy">
                <h3>Adres & route</h3>
                <p>Augustijnenstraat 2</p>
                <p>3000 Leuven</p>
              </div>
              <div className="contact-map">
                <iframe
                  title="Kaart van In den Boule"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=4.6956%2C50.8785%2C4.7046%2C50.8835&layer=mapnik&marker=50.8810%2C4.7001"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="contact-map-actions">
                <a
                  className="button button-secondary"
                  href="https://www.google.com/maps/dir/?api=1&destination=Augustijnenstraat+2,+3000+Leuven"
                  target="_blank"
                  rel="noreferrer"
                >
                  Route plannen
                </a>
                <a
                  className="button button-secondary contact-map-link"
                  href="https://www.openstreetmap.org/?mlat=50.8810&mlon=4.7001#map=18/50.8810/4.7001"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open kaart in OpenStreetMap
                </a>
              </div>
            </article>
            <article>
              <h3>Bel of mail</h3>
              <p>{site.contactPhone}</p>
              <p>{site.contactEmail}</p>
            </article>
            <article>
              <h3>Openingsuren</h3>
              <p>Zondag: 20u - 03u</p>
              <p>Maandag - donderdag: 11u - 03u</p>
              <p>Vrijdag & zaterdag: gesloten</p>
              <p>Keuken altijd doorlopend open</p>
            </article>
            <article>
              <h3>Volgende integratie</h3>
              <p>Deze formulieren landen later in Supabase en sturen notificaties naar het team.</p>
            </article>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
