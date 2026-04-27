import Link from "next/link";
import { notFound } from "next/navigation";
import { EventTicketForm } from "@/components/event-ticket-form";
import { SiteShell } from "@/components/site-shell";
import { events } from "@/lib/site-data";
import { getEventBySlug } from "@/lib/sanity/loaders";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <SiteShell ctaHref="/events" ctaLabel="Bekijk alle events">
      <section className="page-hero">
        <p className="eyebrow">Event</p>
        <h1>{event.title}</h1>
        <p className="page-intro">{event.description}</p>
      </section>

      <section className="contact-band contact-band-page">
        <div>
          <p className="eyebrow">Praktisch</p>
          <h2>
            {event.dateLabel} · {event.priceLabel} · {event.availabilityLabel}
          </h2>
          {event.venue ? <p style={{ marginTop: "0.75rem" }}>{event.venue}</p> : null}
        </div>
        {event.ticketingMode === "external" && event.ticketUrl ? (
          <Link className="button" href={event.ticketUrl}>
            {event.ctaLabel}
          </Link>
        ) : event.ticketingMode === "info" ? (
          <Link className="button" href="/contact">
            Contacteer de organisatie
          </Link>
        ) : (
          <Link className="button" href="#tickets">
            {event.ctaLabel}
          </Link>
        )}
      </section>

      <section className="section venue-section">
        <div className="venue-layout">
          <article className="venue-panel">
            <h3>Over dit event</h3>
            <p>{event.description}</p>
          </article>
          {event.ticketingMode === "native" && event.ticketTypes?.length ? (
            <article className="venue-panel venue-panel-accent" id="tickets">
              <h3>Bestel je tickets</h3>
              <p style={{ marginBottom: "1.5rem" }}>
                Kies je tickettype en reken meteen af via Mollie.
              </p>
              <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                {event.ticketTypes.map((ticket) => (
                  <div
                    key={ticket.key}
                    style={{
                      padding: "1rem 1.1rem",
                      borderRadius: "18px",
                      border: "1px solid rgba(86, 60, 28, 0.15)",
                      background: "rgba(255, 250, 241, 0.85)"
                    }}
                  >
                    <strong style={{ display: "block", marginBottom: "0.35rem" }}>
                      {ticket.title} · {ticket.priceLabel}
                    </strong>
                    {ticket.description ? <p style={{ margin: 0 }}>{ticket.description}</p> : null}
                    {typeof ticket.availableQuantity === "number" ? (
                      <p style={{ margin: "0.35rem 0 0", fontSize: "0.95rem" }}>
                        {ticket.availableQuantity} beschikbaar
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              <EventTicketForm
                eventSlug={event.slug}
                eventTitle={event.title}
                ticketTypes={event.ticketTypes}
              />
              {event.ticketInfo ? <p style={{ marginTop: "1rem" }}>{event.ticketInfo}</p> : null}
            </article>
          ) : (
            <article className="venue-panel venue-panel-accent">
              <h3>Ticketinfo</h3>
              <p>
                {event.ticketInfo ||
                  "Ticketverkoop voor dit event loopt via de organisatie. Neem contact op voor beschikbaarheid."}
              </p>
              <Link className="button" href={event.ticketUrl || "/contact"}>
                {event.ticketingMode === "external" ? "Open ticketpagina" : "Contacteer ons"}
              </Link>
            </article>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
