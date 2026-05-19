import { cookies } from "next/headers";
import type { Metadata } from "next";
import { GiftCardAdminAccessForm } from "@/components/gift-card-admin-access-form";
import { GiftCardRedeemForm } from "@/components/gift-card-redeem-form";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getGiftCardAdminCode } from "@/lib/internal-admin-access";
import {
  GIFT_CARD_ADMIN_COOKIE_NAME,
  hasValidGiftCardAdminAccess
} from "@/lib/gift-card-access";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default async function GiftCardRedeemPage() {
  const cookieStore = await cookies();
  const adminCode = getGiftCardAdminCode();
  const hasAccess = hasValidGiftCardAdminAccess(
    cookieStore.get(GIFT_CARD_ADMIN_COOKIE_NAME)?.value,
    adminCode
  );

  return (
    <SiteShell ctaHref="/shop" ctaLabel="Terug naar shop">
      <PageHero
        eyebrow="Cadeaubon redeem"
        title="Controleer en verzilver cadeaubonnen."
        intro="Gebruik deze interne tool om een cadeauboncode te controleren en als ingeruild te markeren."
      />

      <section className="section venue-section">
        {!hasAccess ? (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <h3>Beveiligde admintool</h3>
              <p>
                Deze redeempagina is beschermd. Geef de interne admincode in om cadeaubonnen te beheren.
              </p>
            </article>
            <article className="venue-panel">
              <GiftCardAdminAccessForm />
            </article>
          </div>
        ) : (
          <GiftCardRedeemForm />
        )}
      </section>
    </SiteShell>
  );
}
