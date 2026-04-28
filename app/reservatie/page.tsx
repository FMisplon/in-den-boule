import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { ReservationForm } from "@/components/reservation-form";
import { getPageHeroImage } from "@/lib/sanity/loaders";

export const revalidate = 60;

export default async function ReservatiePage() {
  const heroImage = await getPageHeroImage("reservatie");

  return (
    <SiteShell ctaHref="/contact" ctaLabel="Groepen & vragen">
      <PageHero
        eyebrow="Reservatie"
        title="Reserveer je tafel in een paar duidelijke stappen."
        intro="Je aanvraag komt rechtstreeks bij het team terecht. We werken zonder ruis: kies je dag, geef je gezelschap door en voeg gerust extra context toe als er iets belangrijk is."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section reservatie-section">
        <div className="reservation-layout">
          <div className="floor-plan">
            <div className="plan-header">
              <h3>Zo verloopt je aanvraag</h3>
              <span>We bekijken elke reservatie zorgvuldig en koppelen snel terug zodra je aanvraag bevestigd is.</span>
            </div>
            <div className="plan-grid">
              <div className="table-pill available">Datum & uur</div>
              <div className="table-pill available">Aantal personen</div>
              <div className="table-pill terrace">Contactgegevens</div>
              <div className="table-pill lounge">Opmerking / context</div>
            </div>
            <p className="form-hint" style={{ marginTop: "1rem" }}>
              Vermeld gerust een verjaardag, allergie, grotere groep of iets anders waar we best rekening mee houden.
            </p>
          </div>
          <ReservationForm />
        </div>
      </section>
    </SiteShell>
  );
}
