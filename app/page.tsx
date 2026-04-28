import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/site-shell";
import { getEvents, getHomePage, getSiteSettings } from "@/lib/sanity/loaders";

export const revalidate = 60;

function formatPromoDate(value: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    timeZone: "Europe/Brussels",
    day: "numeric",
    month: "long"
  }).format(new Date(`${value}T12:00:00+02:00`));
}

export default async function HomePage() {
  const [events, site, home] = await Promise.all([getEvents(), getSiteSettings(), getHomePage()]);

  return (
    <SiteShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{home.heroEyebrow || site.name}</p>
          <h1>{home.heroTitle || site.tagline}</h1>
          <p className="hero-text">{home.heroText}</p>
          <div className="hero-actions">
            <Link className="button" href={home.primaryCtaHref}>
              {home.primaryCtaLabel}
            </Link>
            <Link className="button button-secondary" href={home.secondaryCtaHref}>
              {home.secondaryCtaLabel}
            </Link>
          </div>
          <ul className="hero-points">
            {home.heroPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" />
      </section>

      <section className="info-strip">
        <div>
          <span>Adres</span>
          <strong>{site.address}</strong>
        </div>
        <div>
          <span>Open</span>
          <strong>Zo: 20u-03u · Ma-Do: 11u-03u · Vr-Za gesloten</strong>
        </div>
        <div>
          <span>Keuken</span>
          <strong>{site.kitchen}</strong>
        </div>
      </section>

      <section className="story-ribbon">
        <article className="story-card story-card-photo">
          <img src="/assets/images/evy.jpg" alt="Evy in In den Boule" />
        </article>
        <article className="story-card story-card-copy">
          <p className="eyebrow">{home.storyEyebrow}</p>
          <h2>{home.storyTitle}</h2>
          <p>{home.storyText}</p>
        </article>
        <article className="story-card story-card-logo">
          <img src="/assets/images/logo-boule-transparent.png" alt="Boule logo in groen" />
        </article>
      </section>

      {home.promotions.length ? (
        <section className="section home-promo-section">
          <div className="section-heading">
            <p className="eyebrow">{home.promotionsEyebrow}</p>
            <h2>{home.promotionsTitle}</h2>
          </div>
          <div className="home-promo-list">
            {home.promotions.map((promotion) => (
              <article className="home-promo-card" key={`${promotion.title}-${promotion.startsOn}`}>
                <div className="home-promo-media">
                  {promotion.imageUrl ? (
                    <Image
                      src={promotion.imageUrl}
                      alt={promotion.imageAlt || promotion.title}
                      fill
                      sizes="(max-width: 980px) 100vw, 34vw"
                    />
                  ) : null}
                </div>
                <div className="home-promo-copy">
                  <span className="home-promo-date">
                    {promotion.startsOn === promotion.endsOn
                      ? `Alleen op ${formatPromoDate(promotion.startsOn)}`
                      : `${formatPromoDate(promotion.startsOn)} tot ${formatPromoDate(promotion.endsOn)}`}
                  </span>
                  <h3>{promotion.title}</h3>
                  <p>{promotion.body}</p>
                  {promotion.ctaLabel && promotion.ctaHref ? (
                    <Link className="button" href={promotion.ctaHref}>
                      {promotion.ctaLabel}
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section concept-section">
        <div className="section-heading">
          <p className="eyebrow">{home.conceptEyebrow}</p>
          <h2>{home.conceptTitle}</h2>
        </div>
        <div className="concept-grid">
          {home.conceptCards.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section social-section">
        <div className="section-heading">
          <p className="eyebrow">{home.highlightsEyebrow}</p>
          <h2>{home.highlightsTitle}</h2>
        </div>
        <div className="discover-grid">
          {home.highlightCards.map((card) => (
            <article className="discover-card" key={card.title}>
              {card.eyebrow ? <span>{card.eyebrow}</span> : null}
              <h3>{card.title}</h3>
              <p>
                {card.ctaHref === "/events" && card.body.includes("{eventCount}")
                  ? card.body.replace("{eventCount}", String(events.length))
                  : card.body}
              </p>
              {card.ctaLabel && card.ctaHref ? (
                <Link className="button" href={card.ctaHref}>
                  {card.ctaLabel}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
