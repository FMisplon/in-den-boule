import Link from "next/link";
import { notFound } from "next/navigation";
import { ConversionTracker } from "@/components/conversion-tracker";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { buildGiftCardUrl, ensureGiftCardIssued, generateGiftCardPdf } from "@/lib/gift-cards";
import { sendGiftCardFulfillmentEmails } from "@/lib/mailer";
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
    .select("id,status,mollie_payment_id,purchaser_name,purchaser_email,recipient_name,recipient_email,personal_message,amount_cents,currency,fulfillment_mode,pickup_in_store,voucher_issued_at,fulfillment_sent_at")
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
  let voucher = null as Awaited<ReturnType<typeof ensureGiftCardIssued>>;
  let mailWarning = "";

  if (isPaid) {
    try {
      voucher = await ensureGiftCardIssued(supabase, giftCardOrder);

      if (voucher && !giftCardOrder.fulfillment_sent_at) {
        const pdfBytes = await generateGiftCardPdf(voucher);
        const mailResult = await sendGiftCardFulfillmentEmails({
          orderId: giftCardOrder.id,
          purchaserName: giftCardOrder.purchaser_name,
          purchaserEmail: giftCardOrder.purchaser_email,
          recipientName: giftCardOrder.recipient_name,
          recipientEmail: giftCardOrder.recipient_email,
          amountCents: giftCardOrder.amount_cents,
          currency: giftCardOrder.currency,
          pickupInStore: giftCardOrder.pickup_in_store,
          fulfillmentMode: giftCardOrder.fulfillment_mode,
          voucher,
          pdfBytes
        });

        if (mailResult.delivered) {
          await supabase
            .from("gift_card_orders")
            .update({ fulfillment_sent_at: new Date().toISOString() })
            .eq("id", giftCardOrder.id);
        } else if (mailResult.warning) {
          mailWarning = mailResult.warning;
        }
      }
    } catch {
      mailWarning =
        "De betaling is bevestigd, maar het klaarzetten van de cadeaubon liep nog niet volledig goed. Neem even contact op met het team.";
    }
  }

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
            ? giftCardOrder.pickup_in_store
              ? `Uw betaling van ${amountLabel} werd goed ontvangen. We leggen de cadeaubon voor ${giftCardOrder.recipient_name} klaar voor afhaling in Café In den Boule.`
              : `Uw betaling van ${amountLabel} werd goed ontvangen. De cadeaubon voor ${giftCardOrder.recipient_name} staat klaar voor verdere verwerking.`
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
              ? giftCardOrder.pickup_in_store
                ? "We sturen een afhaalbevestiging naar de koper en een interne melding naar het team."
                : giftCardOrder.fulfillment_mode === "send" && giftCardOrder.recipient_email
                  ? `De cadeaubon gaat naar ${giftCardOrder.recipient_email}. De koper ontvangt ook een bevestiging.`
                  : `De bon belandt op ${giftCardOrder.purchaser_email}.`
              : `Huidige betaalstatus: ${paymentStatus}.`}
          </h2>
          {mailWarning ? <p style={{ marginTop: "0.75rem" }}>{mailWarning}</p> : null}
        </div>
        <Link className="button" href="/contact">
          Contacteer ons
        </Link>
      </section>

      {isPaid && voucher ? (
        <section className="section venue-section">
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <h3>{giftCardOrder.pickup_in_store ? "Afhaalinfo" : "Cadeaubon klaar"}</h3>
              <p>
                <strong>Code:</strong> <code>{voucher.voucher_code}</code>
              </p>
              <p>
                {giftCardOrder.pickup_in_store
                  ? "Deze cadeaubon staat intern klaar voor afhaling. De code blijft wel gekoppeld aan de bestelling voor opvolging."
                  : "De cadeaubon is online beschikbaar en kan ook als PDF geopend worden."}
              </p>
            </article>

            <article className="venue-panel">
              <h3>Voucher links</h3>
              <p>Open de online voucher of de PDF-versie.</p>
              <div className="checkin-scanner-actions">
                <Link className="button" href={buildGiftCardUrl(voucher.voucher_code)}>
                  Open cadeaubon
                </Link>
                <Link className="button button-secondary" href={`/cadeaubonnen/${voucher.voucher_code}/pdf`}>
                  Open PDF
                </Link>
              </div>
            </article>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
