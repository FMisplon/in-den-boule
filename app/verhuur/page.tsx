import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { VenueInquiryForm } from "@/components/venue-inquiry-form";
import { getPageHeroImage } from "@/lib/sanity/loaders";

export const revalidate = 60;

export default async function VerhuurPage() {
  const heroImage = await getPageHeroImage("verhuur");

  return (
    <SiteShell ctaHref="/contact" ctaLabel="Vraag offerte aan">
      <PageHero
        eyebrow="Verhuur"
        title="Huur In den Boule af voor private events, diners en feestavonden."
        intro="Voor recepties, diners, bedrijfsmomenten en feestavonden huur je geen apart zaaltje, maar het karakter van het hele huis. We denken mee over sfeer, opstelling en praktische omkadering."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section venue-section">
        <div className="venue-layout">
          <article className="venue-panel">
            <h3>Een plek met karakter voor events op maat</h3>
            <p>
              In den Boule is geschikt voor avonden die warmte, persoonlijkheid en een sterk kader
              vragen. Van een intiem diner tot een levendige receptie: we stemmen de setting af op
              het type moment dat je wilt neerzetten.
            </p>
            <ul>
              <li>Private diners, recepties en feestavonden met eigen sfeer</li>
              <li>Flexibele invulling voor bedrijven, teams en particuliere groepen</li>
              <li>Praktische afstemming rond timing, catering, techniek en ontvangst</li>
            </ul>
          </article>
          <article className="venue-panel venue-panel-accent">
            <h3>Formules die hier goed werken</h3>
            <p>Receptie · walking dinner · seated dinner · teambuilding · brunch</p>
            <div className="venue-capacity">
              <span>40 zittend</span>
              <span>70 receptie</span>
              <span>AV mogelijk</span>
            </div>
            <p style={{ marginTop: "1rem" }}>
              Vertel ons hoeveel gasten je verwacht en welk soort avond je voor ogen hebt, dan
              bekijken we samen wat het best past.
            </p>
          </article>
        </div>
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel">
            <p className="eyebrow">Offerteaanvraag</p>
            <h3>Vertel ons kort wat je organiseert.</h3>
            <p>
              Met datum, type event en een ruwe inschatting van het aantal gasten kunnen we snel
              inschatten wat mogelijk is en gericht terugkoppelen.
            </p>
          </article>
          <VenueInquiryForm />
        </div>
      </section>
    </SiteShell>
  );
}
