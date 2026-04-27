import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { getMolliePayment } from "@/lib/mollie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  return (
    <SiteShell ctaHref={`/events/${eventOrder.event_slug}`} ctaLabel="Terug naar event">
      <section className="page-hero">
        <p className="eyebrow">Event tickets</p>
        <h1>{isPaid ? "Bedankt voor uw bestelling." : "Uw betaling is in verwerking."}</h1>
        <p className="page-intro">
          {isPaid
            ? `Uw betaling van ${totalLabel} voor ${eventOrder.quantity} ${eventOrder.ticket_type_title} ticket(s) voor ${eventOrder.event_title} werd goed ontvangen.`
            : "We hebben uw ticketbestelling geregistreerd en controleren nu de betaalstatus."}
        </p>
      </section>

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
