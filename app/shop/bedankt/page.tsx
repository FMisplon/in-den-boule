import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { getMolliePayment } from "@/lib/mollie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function GiftCardThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  if (!order) {
    notFound();
  }

  const supabase = createSupabaseServerClient();
  const { data: giftCardOrder } = await supabase
    .from("gift_card_orders")
    .select("id,status,mollie_payment_id,recipient_name,amount_cents")
    .eq("id", order)
    .maybeSingle();

  if (!giftCardOrder) {
    notFound();
  }

  let paymentStatus = giftCardOrder.status;

  if (giftCardOrder.mollie_payment_id) {
    try {
      const payment = await getMolliePayment(giftCardOrder.mollie_payment_id);
      paymentStatus = payment.status;

      await supabase
        .from("gift_card_orders")
        .update({ status: payment.status })
        .eq("id", giftCardOrder.id);
    } catch {
      paymentStatus = giftCardOrder.status;
    }
  }

  const isPaid = paymentStatus === "paid";

  return (
    <SiteShell ctaHref="/shop" ctaLabel="Terug naar shop">
      <section className="page-hero">
        <p className="eyebrow">Cadeaubon</p>
        <h1>{isPaid ? "Betaling ontvangen." : "Betaling nog in verwerking."}</h1>
        <p className="page-intro">
          {isPaid
            ? `De cadeaubon voor ${giftCardOrder.recipient_name} staat geregistreerd.`
            : "We hebben je bestelling geregistreerd en controleren nu de betaalstatus."}
        </p>
      </section>

      <section className="contact-band contact-band-page">
        <div>
          <p className="eyebrow">Status</p>
          <h2>
            {paymentStatus} · €{(giftCardOrder.amount_cents / 100).toFixed(2)}
          </h2>
        </div>
        <Link className="button" href="/contact">
          Contacteer ons
        </Link>
      </section>
    </SiteShell>
  );
}
