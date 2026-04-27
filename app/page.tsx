import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getEvents, getSiteSettings } from "@/lib/sanity/loaders";

export default async function HomePage() {
  const [events, site] = await Promise.all([getEvents(), getSiteSettings()]);

  return (
    <SiteShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{site.name}</p>
          <h1>{site.tagline}</h1>
          <p className="hero-text">
            Een Leuvense legende met karakter, geschiedenis en lange nachten. Van lunch tot
            late service, van vaste stamgasten tot nieuwe verhalen aan tafel: In den Boule
            voelt tegelijk iconisch en levendig.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/reservatie">
              Reserveer je tafel
            </Link>
            <Link className="button button-secondary" href="/events">
              Bekijk events
            </Link>
          </div>
          <ul className="hero-points">
            <li>Keuken altijd doorlopend open</li>
            <li>Events met ticketverkoop</li>
            <li>Verhuur en cadeaubonnen als aparte flows</li>
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
          <p className="eyebrow">Het verhaal</p>
          <h2>Een plek waar traditie, gezelligheid en nieuwe energie samenkomen.</h2>
          <p>
            De homepage hoeft niet alles tegelijk te verkopen. Hier zetten we vooral het gevoel
            neer, en van hieruit begeleiden we bezoekers gericht naar menu, reservaties, events,
            shop of verhuur.
          </p>
        </article>
        <article className="story-card story-card-logo">
          <img src="/assets/images/logo-boule-transparent.png" alt="Boule logo in groen" />
        </article>
      </section>

      <section className="section concept-section">
        <div className="section-heading">
          <p className="eyebrow">De sfeer</p>
          <h2>Een huis vol verhalen, karakterkoppen, volle glazen en avonden die blijven hangen.</h2>
        </div>
        <div className="concept-grid">
          <article>
            <h3>Legendarisch</h3>
            <p>In den Boule heeft een eigen plaats in Leuven. Die herkenbaarheid moet ook online voelbaar zijn.</p>
          </article>
          <article>
            <h3>Levendig</h3>
            <p>Lunch, diner, events en late service vragen om een site die energie geeft zonder chaotisch te worden.</p>
          </article>
          <article>
            <h3>Gericht</h3>
            <p>Elke hoofdvraag krijgt zijn eigen pagina, zodat bezoekers sneller vinden wat ze nodig hebben en sneller doorklikken.</p>
          </article>
        </div>
      </section>

      <section className="section social-section">
        <div className="section-heading">
          <p className="eyebrow">Highlights</p>
          <h2>De homepage blijft landing page, terwijl de aparte pagina&apos;s de echte acties opvangen.</h2>
        </div>
        <div className="discover-grid">
          <article className="discover-card">
            <span>Menu</span>
            <h3>Eten & drinken</h3>
            <p>Spaghetti en kaart in een eigen flow, zonder afleiding.</p>
            <Link className="button" href="/menu">
              Naar menu
            </Link>
          </article>
          <article className="discover-card">
            <span>Events</span>
            <h3>Programma & tickets</h3>
            <p>{events.length} events klaar als aparte detailpagina&apos;s voor promotie en tickets.</p>
            <Link className="button" href="/events">
              Bekijk events
            </Link>
          </article>
          <article className="discover-card">
            <span>Shop</span>
            <h3>Cadeaubonnen</h3>
            <p>De MVP focust bewust op gift cards als eerste echte checkoutflow.</p>
            <Link className="button" href="/shop">
              Naar shop
            </Link>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
