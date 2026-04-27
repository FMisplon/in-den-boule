import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getEvents, getPageHeroImage } from "@/lib/sanity/loaders";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();
  const heroImage = await getPageHeroImage("events");

  return (
    <SiteShell ctaHref="/events" ctaLabel="Koop tickets">
      <PageHero
        eyebrow="Events"
        title="Avonden met een eigen podium."
        intro="Hier mag alles draaien rond sfeer, programma en ticketverkoop. Elk event krijgt een duidelijke standalone pagina voor promotie en conversie."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section events-section">
        <div className="event-grid">
          {events.map((event, index) => (
            <article className={`event-card ${index === 1 ? "featured-event" : ""}`} key={event.slug}>
              <p className="event-date">{event.dateLabel}</p>
              {event.salesBadge ? <span className="event-status-badge">{event.salesBadge}</span> : null}
              <h3>{event.title}</h3>
              <p>{event.intro}</p>
              <div className="event-meta">
                <span>{event.priceLabel}</span>
                <span>{event.availabilityLabel}</span>
              </div>
              <Link className="button" href={`/${event.slug}`}>
                {event.salesStatus === "waitlist"
                  ? "Bekijk wachtlijst"
                  : event.salesStatus === "sold_out"
                    ? "Bekijk event"
                    : event.ctaLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
