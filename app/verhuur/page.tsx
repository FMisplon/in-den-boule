import { SiteShell } from "@/components/site-shell";
import { VenueInquiryForm } from "@/components/venue-inquiry-form";

export default function VerhuurPage() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Vraag offerte aan">
      <section className="page-hero">
        <p className="eyebrow">Verhuur</p>
        <h1>Huur In den Boule af voor private events, diners en feestavonden.</h1>
        <p className="page-intro">
          Het gaat hier niet om aparte zaaltjes, maar om het afhuren van het café als geheel.
          Daarom krijgt verhuur zijn eigen duidelijke acquisitiepagina.
        </p>
      </section>

      <section className="section venue-section">
        <div className="venue-layout">
          <article className="venue-panel">
            <h3>Wat deze pagina straks moet doen</h3>
            <ul>
              <li>Capaciteit en sfeer tonen</li>
              <li>Formules en type events verduidelijken</li>
              <li>Leadgegevens verzamelen</li>
              <li>Later brochure of PDF-download aanbieden</li>
            </ul>
          </article>
          <article className="venue-panel venue-panel-accent">
            <h3>Voorbeeldformules</h3>
            <p>Walking dinner · seated dinner · receptie · teambuilding · brunch</p>
            <div className="venue-capacity">
              <span>40 zittend</span>
              <span>70 receptie</span>
              <span>AV mogelijk</span>
            </div>
          </article>
        </div>
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel">
            <p className="eyebrow">Offerteaanvraag</p>
            <h3>Vertel kort wat je in gedachten hebt.</h3>
            <p>
              Deze eerste versie verzamelt de kerninformatie zodat het team snel kan opvolgen.
            </p>
          </article>
          <VenueInquiryForm />
        </div>
      </section>
    </SiteShell>
  );
}
