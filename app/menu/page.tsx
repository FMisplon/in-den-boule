import { MenuBrowser } from "@/components/menu-browser";
import { SiteShell } from "@/components/site-shell";
import { getMenuItems } from "@/lib/sanity/loaders";

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <SiteShell ctaHref="/reservatie" ctaLabel="Reserveer je tafel">
      <section className="menu-banner" aria-hidden="true" />

      <section className="section menu-section">
        <div className="section-heading">
          <p className="eyebrow">Kaart</p>
          <h2>De legendarische Boule-kaart.</h2>
        </div>
        <MenuBrowser items={menuItems} />
      </section>
    </SiteShell>
  );
}
