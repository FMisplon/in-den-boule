import { SiteShell } from "@/components/site-shell";
import { GiftCardForm } from "@/components/gift-card-form";

export default function ShopPage() {
  return (
    <SiteShell ctaHref="/shop" ctaLabel="Bestel cadeaubon">
      <section className="page-hero">
        <p className="eyebrow">Shop MVP</p>
        <h1>Cadeaubonnen eerst, uitbreidbaar naar meer.</h1>
        <p className="page-intro">
          Voor de eerste live scope focussen we bewust op digitale cadeaubonnen. Zo kunnen we
          sneller een echte betaalflow opleveren zonder de shop nodeloos breed te maken.
        </p>
      </section>

      <section className="section shop-section">
        <div className="shop-grid">
          <article className="shop-card">
            <span>Cadeaubon</span>
            <h3>Dinerbon op maat</h3>
            <p>Digitale voucher met vrije waarde, klaar voor Mollie checkout en e-maillevering.</p>
          </article>
          <article className="shop-card">
            <span>MVP</span>
            <h3>Snelle livegang</h3>
            <p>Heldere scope: productpagina, bedragkeuze, checkout, bevestiging en mailflow.</p>
          </article>
          <article className="shop-card">
            <span>Later</span>
            <h3>Merch & afhaling</h3>
            <p>De structuur blijft compatibel met fysieke producten, voorraad en pick-up in het café.</p>
          </article>
        </div>
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel">
            <p className="eyebrow">Cadeaubon bestellen</p>
            <h3>Een eenvoudige MVP-flow via Mollie.</h3>
            <p>
              Voor de demo werken we met vaste bedragen van €25, €50, €75 en €100. Na betaling
              slaan we de bestelling op als basis voor verdere opvolging en levering.
            </p>
          </article>
          <GiftCardForm />
        </div>
      </section>
    </SiteShell>
  );
}
