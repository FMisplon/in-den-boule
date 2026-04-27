import Link from "next/link";
import { notFound } from "next/navigation";
import { ConversionTracker } from "@/components/conversion-tracker";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPageHeroImage } from "@/lib/sanity/loaders";
import { getMolliePayment } from "@/lib/mollie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 60;

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
    .select("id,status,mollie_payment_id,recipient_name,purchaser_email,amount_cents")
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
  const amountLabel = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR"
  }).format(giftCardOrder.amount_cents / 100);
  const heroImage = await getPageHeroImage("shop-bedankt");

  return (
    <SiteShell ctaHref="/shop" ctaLabel="Terug naar shop">
      {isPaid ? (
        <>
          <ConversionTracker
            event="purchase"
            payload={{
              transaction_id: giftCardOrder.id,
              currency: "EUR",
              value: giftCardOrder.amount_cents / 100,
              item_category: "gift_card",
              items: [
                {
                  item_id: "gift-card",
                  item_name: "Cadeaubon",
                  item_category: "gift_card",
                  price: giftCardOrder.amount_cents / 100,
                  quantity: 1
                }
              ]
            }}
          />
          <ConversionTracker
            event="gift_card_purchase"
            payload={{
              transaction_id: giftCardOrder.id,
              value: giftCardOrder.amount_cents / 100,
              currency: "EUR"
            }}
          />
        </>
      ) : null}
      <PageHero
        eyebrow="Cadeaubon"
        title={isPaid ? "Bedankt voor uw bestelling." : "Uw betaling is in verwerking."}
        intro={
          isPaid
            ? `Uw betaling van ${amountLabel} werd goed ontvangen. De cadeaubon voor ${giftCardOrder.recipient_name} staat klaar voor verdere verwerking.`
            : "We hebben uw bestelling geregistreerd en controleren nu de betaalstatus."
        }
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="contact-band contact-band-page">
        <div>
          <p className="eyebrow">{isPaid ? "Bevestiging" : "Status"}</p>
          <h2>
            {isPaid
              ? `De bon belandt op ${giftCardOrder.purchaser_email}.`
              : `Huidige betaalstatus: ${paymentStatus}.`}
          </h2>
        </div>
        <Link className="button" href="/contact">
          Contacteer ons
        </Link>
      </section>
    </SiteShell>
  );
}
