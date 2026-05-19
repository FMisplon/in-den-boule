import Link from "next/link";

type EventAdminTicketTypeSummary = {
  key: string;
  title: string;
  soldCount: number;
  checkedInCount: number;
  configuredCapacity?: number;
};

type EventAdminOrder = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  ticket_type_title: string;
  quantity: number;
  total_amount_cents: number;
  currency: string;
  status: string;
  ticketsIssued: number;
  checkedInCount: number;
};

export type EventAdminEventSummary = {
  slug: string;
  title: string;
  dateLabel: string;
  salesStatus?: string;
  revenueCents: number;
  revenueCurrency: string;
  soldCount: number;
  checkedInCount: number;
  paidOrderCount: number;
  pendingOrderCount: number;
  refundedOrderCount: number;
  ticketTypes: EventAdminTicketTypeSummary[];
  orders: EventAdminOrder[];
};

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: currency || "EUR"
  }).format(amountCents / 100);
}

function EventAdminCard({ event }: { event: EventAdminEventSummary }) {
  return (
    <article className="admin-card event-admin-card">
      <div className="admin-card-topline">
        <div>
          <p className="admin-card-kicker">{event.dateLabel}</p>
          <h3>{event.title}</h3>
        </div>
        <span className="admin-pill admin-pill-confirmed">
          {event.soldCount} verkocht
        </span>
      </div>

      <div className="admin-meta-grid">
        <p><strong>Omzet:</strong> {formatCurrency(event.revenueCents, event.revenueCurrency)}</p>
        <p><strong>Check-ins:</strong> {event.checkedInCount}</p>
        <p><strong>Betaalde bestellingen:</strong> {event.paidOrderCount}</p>
        <p><strong>Openstaande bestellingen:</strong> {event.pendingOrderCount}</p>
      </div>

      {event.refundedOrderCount ? (
        <p className="admin-helptext" style={{ marginTop: "0.9rem" }}>
          {event.refundedOrderCount} bestelling(en) staan op geannuleerd / terugbetaald.
        </p>
      ) : null}

      <div className="event-admin-section">
        <div className="event-admin-section-topline">
          <h4>Tickettypes</h4>
          <Link className="button button-secondary" href={`/events/${event.slug}`}>
            Open event
          </Link>
        </div>
        <div className="event-admin-ticket-grid">
          {event.ticketTypes.map((ticketType) => (
            <article key={ticketType.key} className="event-admin-ticket-card">
              <strong>{ticketType.title}</strong>
              <p>
                {ticketType.configuredCapacity
                  ? `${ticketType.soldCount} / ${ticketType.configuredCapacity} verkocht`
                  : `${ticketType.soldCount} verkocht`}
              </p>
              <p>{ticketType.checkedInCount} ingecheckt</p>
            </article>
          ))}
        </div>
      </div>

      <div className="event-admin-section">
        <div className="event-admin-section-topline">
          <h4>Kopers en bestellingen</h4>
          <p className="admin-helptext">Alleen betaalde bestellingen staan standaard bovenaan.</p>
        </div>
        <div className="event-admin-order-list">
          {event.orders.map((order) => (
            <article key={order.id} className="event-admin-order-card">
              <div className="event-admin-order-topline">
                <div>
                  <strong>{order.customer_name}</strong>
                  <p>
                    <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>
                  </p>
                </div>
                <span className={`admin-pill admin-pill-${order.status === "paid" ? "confirmed" : order.status === "pending" ? "processing" : "archived"}`}>
                  {order.status}
                </span>
              </div>
              <div className="admin-meta-grid">
                <p><strong>Tickettype:</strong> {order.ticket_type_title}</p>
                <p><strong>Aantal:</strong> {order.quantity}</p>
                <p><strong>Uitgegeven tickets:</strong> {order.ticketsIssued}</p>
                <p><strong>Ingecheckt:</strong> {order.checkedInCount}</p>
                <p><strong>Totaal:</strong> {formatCurrency(order.total_amount_cents, order.currency)}</p>
                <p><strong>Aangekocht:</strong> {new Date(order.created_at).toLocaleString("nl-BE")}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </article>
  );
}

export function EventAdminBoard({ events }: { events: EventAdminEventSummary[] }) {
  if (!events.length) {
    return (
      <div className="venue-layout venue-form-layout">
        <article className="venue-panel venue-panel-accent">
          <h3>Nog geen ticketverkopen</h3>
          <p>Betaalde eventbestellingen verschijnen hier zodra er tickets verkocht worden.</p>
        </article>
      </div>
    );
  }

  return (
    <div className="admin-board">
      {events.map((event) => (
        <EventAdminCard key={event.slug} event={event} />
      ))}
    </div>
  );
}
