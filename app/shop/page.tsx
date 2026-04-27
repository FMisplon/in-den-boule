import { SiteShell } from "@/components/site-shell";
import { GiftCardForm } from "@/components/gift-card-form";
import { PageHero } from "@/components/page-hero";
import { getPageHeroImage, getShopProducts } from "@/lib/sanity/loaders";

export const revalidate = 60;

function formatPriceOptions(amounts: number[]) {
  return amounts
    .map((amount) =>
      new Intl.NumberFormat("nl-BE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
      }).format(amount / 100)
    )
    .join(" · ");
}

export default async function ShopPage() {
  const products = await getShopProducts();
  const heroImage = await getPageHeroImage("shop");
  const giftCardProduct = products.find(
    (product) => product.productType === "gift-card-digital" && product.priceOptions.length > 0
  );

  return (
    <SiteShell ctaHref="/shop" ctaLabel="Bestel cadeaubon">
      <PageHero
        eyebrow="Shop"
        title="Cadeaubonnen voor gebruik in Café In den Boule."
        intro="Je bestelt en betaalt de cadeaubon online, maar de bon zelf wordt later gebruikt in het café. De structuur blijft tegelijk klaarstaan voor latere fysieke producten."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section shop-section">
        <div className="shop-grid">
          {products.map((product) => (
            <article className="shop-card" key={product.slug}>
              <span>
                {product.productType === "gift-card-digital" ? "Digitale cadeaubon" : "Fysiek product"}
              </span>
              <h3>{product.title}</h3>
              <p>
                {product.excerpt ||
                  "Dit product wordt via Sanity beheerd en kan later verder uitgebreid worden."}
              </p>
              <strong>
                {product.priceOptions.length
                  ? formatPriceOptions(product.priceOptions.map((option) => option.amount))
                  : "Binnenkort beschikbaar"}
              </strong>
            </article>
          ))}
        </div>
        {giftCardProduct ? (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel">
              <p className="eyebrow">Cadeaubon bestellen</p>
              <h3>{giftCardProduct.title}</h3>
              <p>
                {giftCardProduct.excerpt ||
                  "Na betaling maken we een cadeaubon aan die later in Café In den Boule kan worden ingewisseld."}
              </p>
              <p style={{ marginTop: "1rem" }}>
                Deze cadeaubon is dus geen online betaalmiddel op de site zelf, maar een voucher
                voor later gebruik in het café.
              </p>
              <p style={{ marginTop: "1rem" }}>
                Beschikbare bedragen:{" "}
                <strong>
                  {formatPriceOptions(giftCardProduct.priceOptions.map((option) => option.amount))}
                </strong>
              </p>
            </article>
            <GiftCardForm product={giftCardProduct} />
          </div>
        ) : (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <p className="eyebrow">Shop</p>
              <h3>Nog geen actieve digitale cadeaubon.</h3>
              <p>
                Voeg in Sanity een actief shopproduct van het type digitale cadeaubon toe met
                minstens één prijsoptie om de checkoutflow hier te tonen.
              </p>
            </article>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
