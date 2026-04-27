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
        <MenuBrowser items={menuItems} />
      </section>
    </SiteShell>
  );
}
