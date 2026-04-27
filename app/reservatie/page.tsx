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
        title="Boek je tafel zonder afleiding."
        intro="De eerste versie start bewust basic: aanvraagflow zonder tafelplan, maar wel meteen voorbereid op echte opslag en notificaties."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section reservatie-section">
        <div className="reservation-layout">
          <div className="floor-plan">
            <div className="plan-header">
              <h3>Fase 1 aanpak</h3>
              <span>Vraaggestuurd reserveren, later uitbreidbaar naar zones en tafels.</span>
            </div>
            <div className="plan-grid">
              <div className="table-pill available">Datum & uur</div>
              <div className="table-pill available">Aantal personen</div>
              <div className="table-pill terrace">Contactgegevens</div>
              <div className="table-pill lounge">Opmerking / context</div>
            </div>
          </div>
          <ReservationForm />
        </div>
      </section>
    </SiteShell>
  );
}
