import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { TicketQrCode } from "@/components/ticket-qr-code";
import { resolveCheckInStatus } from "@/lib/event-tickets";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TicketPage({
  params
}: {
  params: Promise<{ ticketCode: string }>;
}) {
  const { ticketCode } = await params;
  const supabase = createSupabaseServerClient();

  const { data: ticket } = await supabase
    .from("event_tickets")
    .select("*")
    .eq("ticket_code", ticketCode)
    .maybeSingle();

  if (!ticket) {
    notFound();
  }

  const { data: order } = await supabase
    .from("event_ticket_orders")
    .select("status")
    .eq("id", ticket.order_id)
    .maybeSingle();

  const orderStatus = order?.status || "unknown";
  const status = resolveCheckInStatus(ticket, orderStatus);
  const statusLabel =
    status === "valid"
      ? "Geldig ticket"
      : status === "used"
        ? "Al ingecheckt"
        : status === "refunded"
          ? "Terugbetaald of geannuleerd"
          : "Ongeldig ticket";

  return (
    <SiteShell ctaHref="/events" ctaLabel="Terug naar events">
      <PageHero
        eyebrow="Eventticket"
        title={ticket.event_title}
        intro={`${ticket.ticket_type_title} · ${statusLabel}`}
      />

      <section className="section venue-section">
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel venue-panel-accent ticket-panel">
            <h3>QR-code</h3>
            <p>Laat deze QR-code scannen aan de ingang.</p>
            <div className="ticket-qr-shell">
              <TicketQrCode value={ticket.qr_payload} />
            </div>
          </article>

          <article className="venue-panel ticket-panel">
            <h3>Ticketgegevens</h3>
            <p><strong>Naam:</strong> {ticket.customer_name}</p>
            <p><strong>Tickettype:</strong> {ticket.ticket_type_title}</p>
            <p><strong>Ticketcode:</strong> <code>{ticket.ticket_code}</code></p>
            <p><strong>Status:</strong> {statusLabel}</p>
            {ticket.checked_in_at ? (
              <p><strong>Check-in tijd:</strong> {new Date(ticket.checked_in_at).toLocaleString("nl-BE")}</p>
            ) : null}
            {status !== "valid" ? (
              <p style={{ marginTop: "1rem" }}>
                Neem bij twijfel contact op met het team van In den Boule aan de deur.
              </p>
            ) : null}
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
