import { MenuBrowser } from "@/components/menu-browser";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getMenuItems, getPageHeroImage } from "@/lib/sanity/loaders";

export const revalidate = 60;

export default async function MenuPage() {
  const menuItems = await getMenuItems();
  const heroImage = await getPageHeroImage("menu");

  return (
    <SiteShell ctaHref="/reservatie" ctaLabel="Reserveer je tafel">
      <PageHero
        eyebrow="Kaart"
        title="De legendarische Boule-kaart."
        intro="Van klassiekers tot veggie favorieten: de menukaart blijft overzichtelijk, warm en direct leesbaar."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />
      <section className="section menu-section">
        {menuItems.length ? (
          <MenuBrowser items={menuItems} />
        ) : (
          <article className="empty-state-card">
            <span>Menu in opbouw</span>
            <h2>Er staan nog geen gepubliceerde menu-items in Sanity.</h2>
            <p>
              Voeg of publiceer menu-items in de Studio en deze pagina vult zich automatisch. De site
              toont hier voortaan geen hardcoded fallbackkaart meer.
            </p>
          </article>
        )}
      </section>
    </SiteShell>
  );
}
