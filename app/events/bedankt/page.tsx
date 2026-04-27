import Link from "next/link";
import { notFound } from "next/navigation";
import { ConversionTracker } from "@/components/conversion-tracker";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPageHeroImage } from "@/lib/sanity/loaders";
import { getMolliePayment } from "@/lib/mollie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function EventThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  if (!order) {
    notFound();
  }

  const supabase = createSupabaseServerClient();
  const { data: eventOrder } = await supabase
    .from("event_ticket_orders")
    .select(
      "id,status,mollie_payment_id,event_slug,event_title,ticket_type_title,customer_email,quantity,total_amount_cents"
    )
    .eq("id", order)
    .maybeSingle();

  if (!eventOrder) {
    notFound();
  }

  let paymentStatus = eventOrder.status;

  if (eventOrder.mollie_payment_id) {
    try {
      const payment = await getMolliePayment(eventOrder.mollie_payment_id);
      paymentStatus = payment.status;

      await supabase
        .from("event_ticket_orders")
        .update({ status: payment.status })
        .eq("id", eventOrder.id);
    } catch {
      paymentStatus = eventOrder.status;
    }
  }

  const isPaid = paymentStatus === "paid";
  const totalLabel = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR"
  }).format(eventOrder.total_amount_cents / 100);
  const heroImage = await getPageHeroImage("events-bedankt");

  return (
    <SiteShell ctaHref={`/events/${eventOrder.event_slug}`} ctaLabel="Terug naar event">
      {isPaid ? (
        <>
          <ConversionTracker
            event="purchase"
            payload={{
              transaction_id: eventOrder.id,
              currency: "EUR",
              value: eventOrder.total_amount_cents / 100,
              item_category: "event_ticket",
              items: [
                {
                  item_id: `${eventOrder.event_slug}:${eventOrder.ticket_type_title}`,
                  item_name: eventOrder.event_title,
                  item_category: "event_ticket",
                  item_variant: eventOrder.ticket_type_title,
                  price: eventOrder.total_amount_cents / eventOrder.quantity / 100,
                  quantity: eventOrder.quantity
                }
              ]
            }}
          />
          <ConversionTracker
            event="event_ticket_purchase"
            payload={{
              transaction_id: eventOrder.id,
              event_slug: eventOrder.event_slug,
              event_title: eventOrder.event_title,
              quantity: eventOrder.quantity,
              value: eventOrder.total_amount_cents / 100,
              currency: "EUR"
            }}
          />
        </>
      ) : null}
      <PageHero
        eyebrow="Event tickets"
        title={isPaid ? "Bedankt voor uw bestelling." : "Uw betaling is in verwerking."}
        intro={
          isPaid
            ? `Uw betaling van ${totalLabel} voor ${eventOrder.quantity} ${eventOrder.ticket_type_title} ticket(s) voor ${eventOrder.event_title} werd goed ontvangen.`
            : "We hebben uw ticketbestelling geregistreerd en controleren nu de betaalstatus."
        }
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="contact-band contact-band-page">
        <div>
          <p className="eyebrow">{isPaid ? "Bevestiging" : "Status"}</p>
          <h2>
            {isPaid
              ? `De bevestiging belandt op ${eventOrder.customer_email}.`
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
