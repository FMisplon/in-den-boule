import { SiteShell } from "@/components/site-shell";
import { ReservationForm } from "@/components/reservation-form";

export default function ReservatiePage() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Groepen & vragen">
      <section className="page-hero">
        <p className="eyebrow">Reservatie</p>
        <h1>Boek je tafel zonder afleiding.</h1>
        <p className="page-intro">
          De eerste versie start bewust basic: aanvraagflow zonder tafelplan, maar wel meteen
          voorbereid op echte opslag en notificaties.
        </p>
      </section>

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
