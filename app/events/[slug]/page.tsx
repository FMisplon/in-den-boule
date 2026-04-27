import Link from "next/link";
import { notFound } from "next/navigation";
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
        </div>
        <Link className="button" href="/contact">
          Contacteer de organisatie
        </Link>
      </section>

      <section className="section venue-section">
        <div className="venue-layout">
          <article className="venue-panel">
            <h3>Waarom deze pagina belangrijk is</h3>
            <p>
              Organisatoren en bezoekers hebben een deelbare bestemming nodig waar timing,
              sfeer, prijs en capaciteit samenkomen. Daarom voorzien we voor elk event een
              eigen URL in plaats van enkel een listing.
            </p>
          </article>
          <article className="venue-panel venue-panel-accent">
            <h3>Volgende stap in de echte build</h3>
            <p>
              Sanity levert de eventcontent, Supabase bewaakt voorraden en Mollie handelt de
              betaling af. Deze demo-route toont die eindstructuur al in de juiste vorm.
            </p>
            <Link className="button" href="/shop">
              Bekijk gift card MVP
            </Link>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
