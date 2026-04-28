import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { AddressLines, OpeningHoursList } from "@/components/site-practical-content";
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
        intro="Alle praktische info en de snelste contactpaden zitten hier samen op een heldere plek, zodat je ons vlot bereikt voor reservaties, groepen, cadeaubonnen of verhuur."
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
                <AddressLines address={site.address} className="practical-stack" />
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
              <OpeningHoursList hours={site.hours} className="practical-stack" />
              <p>Keuken altijd doorlopend open</p>
            </article>
            <article>
              <h3>Snelste weg</h3>
              <p>
                Gebruik het formulier voor een duidelijke vraag of contacteer ons rechtstreeks per
                mail of telefoon als het dringend is.
              </p>
            </article>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
