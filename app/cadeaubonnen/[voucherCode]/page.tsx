import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { TicketQrCode } from "@/components/ticket-qr-code";
import { resolveGiftCardStatus } from "@/lib/gift-cards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GiftCardVoucherPage({
  params
}: {
  params: Promise<{ voucherCode: string }>;
}) {
  const { voucherCode } = await params;
  const supabase = createSupabaseServerClient();

  const { data: giftCard } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("voucher_code", voucherCode)
    .maybeSingle();

  if (!giftCard) {
    notFound();
  }

  const { data: order } = await supabase
    .from("gift_card_orders")
    .select("status")
    .eq("id", giftCard.order_id)
    .maybeSingle();

  const status = resolveGiftCardStatus(giftCard, order?.status || "unknown");
  const amountLabel = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: giftCard.currency
  }).format(giftCard.amount_cents / 100);
  const statusLabel =
    status === "valid"
      ? "Klaar om in te wisselen"
      : status === "used"
        ? "Al ingeruild"
        : status === "refunded"
          ? "Geannuleerd of terugbetaald"
          : "Ongeldig";

  return (
    <SiteShell ctaHref="/shop" ctaLabel="Terug naar shop">
      <PageHero
        eyebrow="Cadeaubon"
        title={`Voucher ${giftCard.voucher_code}`}
        intro={`${amountLabel} · ${statusLabel}`}
      />

      <section className="section venue-section">
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel venue-panel-accent ticket-panel">
            <h3>Voucher QR</h3>
            <p>Toon deze QR-code of de PDF bij redeem in Café In den Boule.</p>
            <div className="ticket-qr-shell">
              <TicketQrCode value={giftCard.qr_payload} />
            </div>
          </article>

          <article className="venue-panel ticket-panel">
            <h3>Vouchergegevens</h3>
            <p><strong>Ontvanger:</strong> {giftCard.recipient_name}</p>
            <p><strong>Waarde:</strong> {amountLabel}</p>
            <p><strong>Code:</strong> <code>{giftCard.voucher_code}</code></p>
            <p><strong>Status:</strong> {statusLabel}</p>
            {giftCard.personal_message ? (
              <p><strong>Boodschap:</strong> {giftCard.personal_message}</p>
            ) : null}
            {giftCard.redeemed_at ? (
              <p><strong>Ingeruild op:</strong> {new Date(giftCard.redeemed_at).toLocaleString("nl-BE")}</p>
            ) : null}
            <Link className="button" href={`/cadeaubonnen/${giftCard.voucher_code}/pdf`}>
              Download PDF
            </Link>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
