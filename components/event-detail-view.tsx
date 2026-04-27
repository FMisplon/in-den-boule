import Link from "next/link";
import { EventAccessForm } from "@/components/event-access-form";
import { PageHero } from "@/components/page-hero";
import { RichTextContent } from "@/components/rich-text-content";
import { EventTicketForm } from "@/components/event-ticket-form";
import { EventWaitlistForm } from "@/components/event-waitlist-form";
import { SiteShell } from "@/components/site-shell";
import type { EventItem } from "@/lib/site-data";

type EventDetailViewProps = {
  event: EventItem & { accessPassword?: string };
  isUnlocked?: boolean;
};

export function EventDetailView({ event, isUnlocked = true }: EventDetailViewProps) {
  const requiresPassword = event.accessMode === "password";
  const blocked = requiresPassword && !isUnlocked;
  const salesStatus = event.salesStatus || "on_sale";
  const canBuyTickets = event.canBuyTickets !== false;

  return (
    <SiteShell ctaHref="/events" ctaLabel="Bekijk alle events">
      <PageHero
        eyebrow={event.listingVisibility === "private" ? "Prive event" : "Event"}
        title={event.title}
        intro={event.description}
        imageUrl={event.heroImageUrl}
        imageAlt={event.title}
      >
        {event.salesBadge ? (
          <span className="event-status-badge event-status-badge-hero">{event.salesBadge}</span>
        ) : null}
        {event.salesStatus === "presale" &&
        (event.listingVisibility === "private" || event.accessMode === "password") ? (
          <p className="page-intro" style={{ marginTop: "1rem" }}>
            Presale enkel op uitnodiging. Deel de rechtstreekse link alleen met de juiste gasten.
          </p>
        ) : null}
      </PageHero>

      <section className="contact-band contact-band-page">
        <div>
          <p className="eyebrow">Praktisch</p>
          <h2>
            {event.dateLabel} · {event.priceLabel} · {event.availabilityLabel}
          </h2>
          {event.venue ? <p style={{ marginTop: "0.75rem" }}>{event.venue}</p> : null}
        </div>
        {blocked ? (
          <Link className="button" href="#toegang">
            Open met wachtwoord
          </Link>
        ) : salesStatus === "sold_out" ? (
          <Link className="button" href="/contact">
            Contacteer ons
          </Link>
        ) : salesStatus === "waitlist" ? (
          <Link className="button" href="#waitlist">
            Schrijf je in op wachtlijst
          </Link>
        ) : event.ticketingMode === "external" && event.ticketUrl ? (
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
            {event.descriptionRich?.length ? (
              <RichTextContent value={event.descriptionRich} className="rich-text-content" />
            ) : (
              <p>{event.description}</p>
            )}
            {event.body?.length ? (
              <RichTextContent value={event.body} className="rich-text-content" />
            ) : null}
            {event.listingVisibility === "private" ? (
              <p style={{ marginTop: "1rem" }}>
                Dit event verschijnt niet op de openbare evenementenpagina en is alleen
                bereikbaar via de rechtstreekse link.
              </p>
            ) : null}
            {salesStatus === "presale" &&
            (event.listingVisibility === "private" || event.accessMode === "password") ? (
              <p style={{ marginTop: "1rem" }}>
                Deze presale is bewust afgeschermd en bedoeld voor gasten met de juiste link of toegangscode.
              </p>
            ) : null}
          </article>

          {blocked ? (
            <article className="venue-panel venue-panel-accent" id="toegang">
              <h3>Beveiligde toegang</h3>
              <p style={{ marginBottom: "1.5rem" }}>
                Dit event is afgeschermd. Geef het wachtwoord in om ticketinfo en bestelopties te zien.
              </p>
              <EventAccessForm eventSlug={event.slug} eventTitle={event.title} />
            </article>
          ) : event.ticketingMode === "native" && event.ticketTypes?.length && canBuyTickets ? (
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
                    {ticket.descriptionRich?.length ? (
                      <RichTextContent value={ticket.descriptionRich} className="rich-text-content" />
                    ) : ticket.description ? (
                      <p style={{ margin: 0 }}>{ticket.description}</p>
                    ) : null}
                    {typeof ticket.availableQuantity === "number" ? (
                      <p style={{ margin: "0.35rem 0 0", fontSize: "0.95rem" }}>
                        {ticket.isSoldOut ? "Uitverkocht" : `${ticket.availableQuantity} beschikbaar`}
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
              {event.ticketInfoRich?.length ? (
                <RichTextContent value={event.ticketInfoRich} className="rich-text-content" />
              ) : event.ticketInfo ? (
                <p style={{ marginTop: "1rem" }}>{event.ticketInfo}</p>
              ) : null}
            </article>
          ) : (
            <article className="venue-panel venue-panel-accent" id={salesStatus === "waitlist" ? "waitlist" : undefined}>
              <h3>
                {salesStatus === "waitlist"
                  ? "Wachtlijst"
                  : salesStatus === "sold_out"
                    ? "Uitverkocht"
                    : "Ticketinfo"}
              </h3>
              <p>
                {salesStatus === "waitlist"
                  ? event.ticketInfo ||
                    "Laat hieronder je gegevens achter en we contacteren je zodra er opnieuw plaatsen beschikbaar zijn."
                  : salesStatus === "sold_out"
                    ? event.ticketInfo ||
                      "Alle tickets voor dit event zijn momenteel opgebruikt. Neem contact op als je op de hoogte wilt blijven."
                    : event.ticketInfo ||
                      "Ticketverkoop voor dit event loopt via de organisatie. Neem contact op voor beschikbaarheid."}
              </p>
              {salesStatus === "waitlist" ? (
                <EventWaitlistForm eventSlug={event.slug} eventTitle={event.title} />
              ) : (
                <Link className="button" href={event.ticketUrl || "/contact"}>
                  {salesStatus === "sold_out"
                    ? "Vraag naar extra plaatsen"
                    : event.ticketingMode === "external"
                      ? "Open ticketpagina"
                      : "Contacteer ons"}
                </Link>
              )}
            </article>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
