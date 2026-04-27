import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPageHeroImage } from "@/lib/sanity/loaders";
import { site } from "@/lib/site-data";

const lastUpdated = "27 april 2026";

export const revalidate = 60;

export default async function PrivacyPage() {
  const heroImage = await getPageHeroImage("privacy");

  return (
    <SiteShell>
      <PageHero
        eyebrow="Privacybeleid"
        title="Hoe In den Boule persoonsgegevens verwerkt via de website."
        intro="Dit privacybeleid legt uit welke persoonsgegevens via de website van In den Boule kunnen worden verwerkt, waarom dat gebeurt, met wie gegevens gedeeld kunnen worden en welke rechten bezoekers en klanten hebben."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section legal-section">
        <div className="legal-layout">
          <article className="legal-card legal-card-highlight">
            <p className="legal-kicker">Laatste update</p>
            <p>{lastUpdated}</p>
            <p className="legal-meta">
              Deze tekst is afgestemd op de huidige websitearchitectuur met Hostinger, Sanity,
              Supabase, Mollie, mailverwerking en optionele GTM/GA4-metingen na toestemming. De
              officiële juridische naam van de uitbater, maatschappelijke zetel, KBO en
              btw-gegevens moeten nog definitief worden toegevoegd.
            </p>
          </article>

          <article className="legal-card">
            <h2>1. Wie is verantwoordelijk voor de verwerking?</h2>
            <p>
              Deze website wordt uitgebaat onder de naam <strong>{site.name}</strong>, bereikbaar
              via {site.address}, <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>{" "}
              en <a href={`tel:${site.contactPhone.replace(/\s+/g, "")}`}>{site.contactPhone}</a>.
            </p>
            <p>
              Nog aan te vullen voor finale publicatie: officiële naam van de uitbater of
              vennootschap, maatschappelijke zetel, ondernemingsnummer/KBO en btw-nummer.
            </p>
          </article>

          <article className="legal-card">
            <h2>2. Welke persoonsgegevens kunnen we verwerken?</h2>
            <ul>
              <li>
                Contactgegevens zoals naam, e-mailadres, telefoonnummer en andere gegevens die je
                zelf invult in een formulier.
              </li>
              <li>
                Reservatiegegevens zoals datum, uur, aantal personen en eventuele opmerkingen.
              </li>
              <li>
                Gegevens over verhuur- of offerteaanvragen, zoals type event, gewenste datum,
                aantal gasten en bijkomend bericht.
              </li>
              <li>
                Gegevens over eventinteresse, zoals wachtlijstinschrijvingen met naam en
                e-mailadres.
              </li>
              <li>
                Gegevens over eventticketbestellingen, zoals naam, e-mailadres, gekozen tickettype,
                aantal tickets en bestelgegevens.
              </li>
              <li>
                Gegevens over cadeaubonbestellingen, zoals naam van koper, e-mailadres, naam van
                ontvanger, persoonlijke boodschap en gekozen bedrag.
              </li>
              <li>Nieuwsbriefgegevens zoals e-mailadres en inschrijfbron.</li>
              <li>
                Technische gegevens die nodig zijn om de website veilig en correct te laten werken,
                zoals functionele sessiegegevens of beveiligingsinformatie.
              </li>
            </ul>
          </article>

          <article className="legal-card">
            <h2>3. Waarom verwerken we die gegevens?</h2>
            <ul>
              <li>Om reservatie-, contact- en verhuuraanvragen te ontvangen en op te volgen.</li>
              <li>Om eventwachtlijsten te beheren en geïnteresseerden te contacteren.</li>
              <li>Om eventticket- en cadeaubonbestellingen te verwerken.</li>
              <li>Om betalingen via Mollie te kunnen initiëren en administratief op te volgen.</li>
              <li>Om bevestigingen, interne meldingen en autoreplies via e-mail te versturen.</li>
              <li>Om nieuwsbriefinschrijvingen te bewaren en later nieuwsbrieven te versturen.</li>
              <li>
                Om afgeschermde eventpagina&apos;s technisch toegankelijk te maken voor wie geldige
                toegangsgegevens heeft.
              </li>
              <li>Om de website te beveiligen, verbeteren en technisch beschikbaar te houden.</li>
            </ul>
          </article>

          <article className="legal-card">
            <h2>4. Op welke rechtsgronden baseren we ons?</h2>
            <ul>
              <li>
                Uitvoering van een overeenkomst of precontractuele stappen, bijvoorbeeld bij
                reservaties, aanvragen, cadeaubonnen, tickets en eventopvolging.
              </li>
              <li>
                Toestemming, bijvoorbeeld wanneer je je inschrijft voor een nieuwsbrief of
                uitdrukkelijk kiest voor bijkomende communicatie.
              </li>
              <li>
                Gerechtvaardigd belang, bijvoorbeeld voor redelijke interne opvolging, beveiliging,
                misbruikpreventie en technische werking van de website.
              </li>
              <li>
                Wettelijke verplichtingen, voor zover bepaalde administratie, boekhouding of
                betaalopvolging daaraan onderworpen is.
              </li>
            </ul>
          </article>

          <article className="legal-card">
            <h2>5. Met welke partijen kunnen gegevens worden gedeeld?</h2>
            <p>
              We delen persoonsgegevens alleen met partijen die nodig zijn voor de werking van de
              website of de gevraagde dienstverlening, bijvoorbeeld:
            </p>
            <ul>
              <li>
                <strong>Hostinger</strong> voor hosting en technische infrastructuur van de website.
              </li>
              <li>
                <strong>Sanity</strong> als contentplatform voor beheer van website-inhoud en
                eventcontent.
              </li>
              <li>
                <strong>Supabase</strong> voor opslag en beheer van formulierdata, bestellingen,
                nieuwsbriefinschrijvingen en wachtlijstdata.
              </li>
              <li>
                <strong>Mollie</strong> voor online betalingen van eventtickets en cadeaubonnen.
              </li>
              <li>
                <strong>Mailinfrastructuur</strong> voor het verzenden van interne meldingen,
                bevestigingsmails en autoreplies.
              </li>
              <li>
                <strong>Google Tag Manager en Google Analytics 4</strong> voor webmeting en
                conversieregistratie, maar uitsluitend nadat de bezoeker daarvoor toestemming heeft
                gegeven via de cookiebanner.
              </li>
            </ul>
            <p>
              Wanneer je de betaalflow van Mollie gebruikt, verwerkt Mollie bepaalde gegevens ook
              vanuit zijn eigen rol als gereguleerde betalingsdienstverlener.
            </p>
          </article>

          <article className="legal-card">
            <h2>6. Internationale doorgiften</h2>
            <p>
              Sommige van de gebruikte technologiepartners kunnen persoonsgegevens verwerken buiten
              België of buiten de Europese Economische Ruimte. In dat geval gebeurt dit, voor zover
              vereist, op basis van passende waarborgen zoals contractuele
              beschermingsmechanismen van de betrokken leverancier.
            </p>
          </article>

          <article className="legal-card">
            <h2>7. Hoe lang bewaren we gegevens?</h2>
            <ul>
              <li>
                Contact-, reservatie- en verhuuraanvragen bewaren we zolang dat redelijk nodig is
                voor opvolging en administratie.
              </li>
              <li>
                Eventwachtlijstgegevens bewaren we zolang dat nuttig is voor het betrokken event of
                de opvolging ervan, tenzij een langere wettelijke of administratieve noodzaak
                geldt.
              </li>
              <li>
                Bestel- en betaalgerelateerde gegevens bewaren we zolang nodig voor uitvoering,
                opvolging, boekhouding en eventuele bewijsdoeleinden.
              </li>
              <li>
                Nieuwsbriefgegevens bewaren we totdat je je uitschrijft of we de lijst opschonen.
              </li>
              <li>
                Technische cookies of sessiegegevens bewaren we niet langer dan nodig voor hun
                functie.
              </li>
            </ul>
            <p>
              Concrete bewaartermijnen kunnen verschillen naargelang het type aanvraag, de
              boekhoudkundige verplichtingen en de nood aan redelijke bewijsvoering.
            </p>
          </article>

          <article className="legal-card">
            <h2>8. Welke rechten heb je?</h2>
            <p>Je hebt in principe het recht om:</p>
            <ul>
              <li>informatie te krijgen over de verwerking van je persoonsgegevens;</li>
              <li>inzage te vragen in je persoonsgegevens;</li>
              <li>onjuiste gegevens te laten verbeteren;</li>
              <li>gegevens te laten wissen wanneer dat wettelijk mogelijk is;</li>
              <li>de verwerking te laten beperken in bepaalde gevallen;</li>
              <li>bezwaar te maken tegen bepaalde verwerkingen;</li>
              <li>je toestemming in te trekken wanneer verwerking daarop steunt;</li>
              <li>gegevensoverdraagbaarheid te vragen waar dat wettelijk van toepassing is.</li>
            </ul>
            <p>
              Je kan daarvoor contact opnemen via{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. We kunnen vragen om
              je identiteit redelijk te verifiëren voordat we zo&apos;n verzoek behandelen.
            </p>
          </article>

          <article className="legal-card">
            <h2>9. Klachten</h2>
            <p>
              Als je meent dat je persoonsgegevens onjuist of onrechtmatig worden verwerkt, vragen
              we om eerst contact met ons op te nemen via{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            </p>
            <p>
              Je hebt daarnaast ook het recht om een klacht in te dienen bij de Belgische
              Gegevensbeschermingsautoriteit, Drukpersstraat 35, 1000 Brussel,{" "}
              <a
                href="https://www.gegevensbeschermingsautoriteit.be/contact"
                target="_blank"
                rel="noreferrer"
              >
                gegevensbeschermingsautoriteit.be
              </a>
              .
            </p>
          </article>

          <article className="legal-card">
            <h2>10. Cookies en tracking</h2>
            <p>
              Meer informatie over cookies, functionele toegangscookies, externe diensten en het
              gebruik van Google Tag Manager en Google Analytics 4 na toestemming vind je in ons{" "}
              <a href="/cookiebeleid">cookiebeleid</a>.
            </p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
