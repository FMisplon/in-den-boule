import Link from "next/link";
import { notFound } from "next/navigation";
import { ConversionTracker } from "@/components/conversion-tracker";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { ensureEventTicketsIssued } from "@/lib/event-tickets";
import type { EventTicketRecord } from "@/lib/event-tickets";
import { sendEventTicketConfirmationEmails } from "@/lib/mailer";
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
      "id,status,mollie_payment_id,event_slug,event_title,ticket_type_key,ticket_type_title,customer_name,customer_email,quantity,unit_price_cents,total_amount_cents,currency,tickets_issued_at,confirmation_sent_at"
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
  let tickets: EventTicketRecord[] = [];
  let mailWarning = "";

  if (isPaid) {
    try {
      tickets = await ensureEventTicketsIssued(supabase, eventOrder);

      if (!eventOrder.confirmation_sent_at && tickets.length > 0) {
        const mailResult = await sendEventTicketConfirmationEmails({
          orderId: eventOrder.id,
          customerName: eventOrder.customer_name,
          customerEmail: eventOrder.customer_email,
          eventTitle: eventOrder.event_title,
          ticketTypeTitle: eventOrder.ticket_type_title,
          quantity: eventOrder.quantity,
          totalAmountCents: eventOrder.total_amount_cents,
          tickets
        });

        if (mailResult.delivered) {
          await supabase
            .from("event_ticket_orders")
            .update({ confirmation_sent_at: new Date().toISOString() })
            .eq("id", eventOrder.id);
        } else if (mailResult.warning) {
          mailWarning = mailResult.warning;
        }
      }
    } catch {
      mailWarning =
        "De betaling is bevestigd, maar het klaarzetten van de tickets liep nog niet volledig goed. Neem even contact op met het team.";
    }
  }

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
          {mailWarning ? <p style={{ marginTop: "0.75rem" }}>{mailWarning}</p> : null}
        </div>
        <Link className="button" href="/contact">
          Contacteer ons
        </Link>
      </section>

      {isPaid && tickets.length > 0 ? (
        <section className="section venue-section">
          <div className="section-heading">
            <p className="eyebrow">Jouw tickets</p>
            <h2>Klaar voor de deur.</h2>
          </div>
          <div className="shop-grid">
            {tickets.map((ticket, index) => (
              <article className="venue-panel" key={ticket.id}>
                <span>Ticket {index + 1}</span>
                <h3>{ticket.ticket_type_title}</h3>
                <p>
                  Code: <code>{ticket.ticket_code}</code>
                </p>
                <p>Open de ticketpagina voor de QR-code en check-in aan de ingang.</p>
                <Link className="button" href={`/tickets/${ticket.ticket_code}`}>
                  Open ticket
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
