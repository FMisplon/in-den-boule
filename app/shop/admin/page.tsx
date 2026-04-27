import Link from "next/link";
import { cookies } from "next/headers";
import { PageHero } from "@/components/page-hero";
import { ShopAdminAccessForm } from "@/components/shop-admin-access-form";
import { ShopAdminBoard } from "@/components/shop-admin-board";
import { SiteShell } from "@/components/site-shell";
import { env } from "@/lib/env";
import {
  GIFT_CARD_ADMIN_COOKIE_NAME,
  hasValidGiftCardAdminAccess
} from "@/lib/gift-card-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ShopAdminPage() {
  const cookieStore = await cookies();
  const hasAccess = hasValidGiftCardAdminAccess(
    cookieStore.get(GIFT_CARD_ADMIN_COOKIE_NAME)?.value,
    env.giftCardAdminAccessCode
  );

  let orders: Array<{
    id: string;
    created_at: string;
    purchaser_name: string;
    purchaser_email: string;
    recipient_name: string;
    recipient_email?: string | null;
    personal_message?: string | null;
    amount_cents: number;
    currency: string;
    status: string;
    mollie_payment_id?: string | null;
    fulfillment_mode?: string | null;
    pickup_in_store?: boolean | null;
    voucher_issued_at?: string | null;
    fulfillment_sent_at?: string | null;
    product_slug?: string | null;
    product_title?: string | null;
    admin_status?: string | null;
    handled_at?: string | null;
    handled_by?: string | null;
    admin_note?: string | null;
    gift_cards?: Array<{
      voucher_code: string;
      redeemed_at?: string | null;
    }> | null;
  }> = [];

  if (hasAccess) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("gift_card_orders")
      .select("*, gift_cards(voucher_code, redeemed_at)")
      .order("created_at", { ascending: false });

    orders = data || [];
  }

  return (
    <SiteShell ctaHref="/shop" ctaLabel="Terug naar shop">
      <PageHero
        eyebrow="Shop admin"
        title="Volg cadeaubonverkopen intern op."
        intro="Deze inbox toont momenteel digitale cadeaubonnen. De structuur blijft tegelijk bruikbaar voor latere fysieke producten die via dezelfde shopflow verkocht worden."
      />

      <section className="section venue-section">
        {!hasAccess ? (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <h3>Beveiligde admintool</h3>
              <p>
                Deze shop-inbox is beschermd. Geef de interne admincode in om bestellingen en opvolgstatussen te beheren.
              </p>
              <p style={{ marginTop: "1rem" }}>
                De aparte redeempagina voor cadeaubonnen blijft daarnaast bestaan voor gebruik aan de kassa.
              </p>
            </article>
            <article className="venue-panel">
              <ShopAdminAccessForm />
            </article>
          </div>
        ) : (
          <>
            <div className="contact-band contact-band-page admin-band">
              <div>
                <p className="eyebrow">Extra tool</p>
                <h2>Cadeaubon inwisselen aan de kassa?</h2>
              </div>
              <Link className="button" href="/cadeaubonnen/redeem">
                Open redeemtool
              </Link>
            </div>
            <ShopAdminBoard orders={orders} />
          </>
        )}
      </section>
    </SiteShell>
  );
}
