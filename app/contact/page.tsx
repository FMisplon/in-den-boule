import { ContactForm } from "@/components/contact-form";
import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/sanity/loaders";

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1>Voor vragen, groepen, cadeaubonnen of verhuur.</h1>
        <p className="page-intro">
          Alle praktische info en de belangrijkste contactpaden zitten hier samen op een
          duidelijke plek, zonder extra ruis op de homepage.
        </p>
      </section>

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
            <article>
              <h3>Bel of mail</h3>
              <p>{site.contactPhone}</p>
              <p>{site.contactEmail}</p>
            </article>
            <article>
              <h3>Adres</h3>
              <p>Augustijnenstraat 2</p>
              <p>3000 Leuven</p>
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
