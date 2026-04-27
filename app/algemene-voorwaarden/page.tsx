import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPageHeroImage, getSiteSettings } from "@/lib/sanity/loaders";
import { site } from "@/lib/site-data";

const lastUpdated = "27 april 2026";

export const revalidate = 60;

export default async function TermsPage() {
  const [heroImage, siteSettings] = await Promise.all([
    getPageHeroImage("algemene-voorwaarden"),
    getSiteSettings()
  ]);
  const legalIdentity = siteSettings.legalEntityName || site.name;
  const hasLegalDetails = Boolean(
    siteSettings.legalEntityName ||
      siteSettings.registeredOffice ||
      siteSettings.companyNumber ||
      siteSettings.vatNumber
  );

  return (
    <SiteShell>
      <PageHero
        eyebrow="Algemene voorwaarden"
        title="De basisvoorwaarden voor gebruik van de site en online aanvragen."
        intro="Deze algemene voorwaarden gelden voor het gebruik van de website van In den Boule en voor aanvragen, reservaties, cadeaubonnen, eventtickets en andere online interacties via deze site."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section legal-section">
        <div className="legal-layout">
          <article className="legal-card legal-card-highlight">
            <p className="legal-kicker">Laatste update</p>
            <p>{lastUpdated}</p>
            <p className="legal-meta">
              Praktische noot: deze tekst is afgestemd op de huidige websiteflow.
              {hasLegalDetails
                ? " De juridische identificatie hieronder wordt automatisch ingelezen uit Site settings."
                : " De officiële juridische identificatie van de uitbater moet nog definitief worden aangevuld."}
            </p>
          </article>

          <article className="legal-card">
            <h2>1. Identiteit van de uitbater</h2>
            <p>
              De website wordt gebruikt voor de activiteiten van <strong>{legalIdentity}</strong>,
              gevestigd te {site.address}, bereikbaar via{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> en{" "}
              <a href={`tel:${site.contactPhone.replace(/\s+/g, "")}`}>{site.contactPhone}</a>.
            </p>
            {hasLegalDetails ? (
              <ul>
                {siteSettings.legalEntityName ? (
                  <li>
                    <strong>Juridische uitbater:</strong> {siteSettings.legalEntityName}
                  </li>
                ) : null}
                {siteSettings.registeredOffice ? (
                  <li>
                    <strong>Maatschappelijke zetel:</strong> {siteSettings.registeredOffice}
                  </li>
                ) : null}
                {siteSettings.companyNumber ? (
                  <li>
                    <strong>KBO / ondernemingsnummer:</strong> {siteSettings.companyNumber}
                  </li>
                ) : null}
                {siteSettings.vatNumber ? (
                  <li>
                    <strong>Btw-nummer:</strong> {siteSettings.vatNumber}
                  </li>
                ) : null}
              </ul>
            ) : (
              <p>
                Nog aan te vullen voor finale publicatie: officiële vennootschapsnaam of naam van de
                uitbater, maatschappelijke zetel, ondernemingsnummer/KBO en btw-nummer.
              </p>
            )}
          </article>

          <article className="legal-card">
            <h2>2. Toepassingsgebied</h2>
            <p>
              Deze voorwaarden zijn van toepassing op elk bezoek aan de website en op elk gebruik
              van formulieren, reservatieaanvragen, contactaanvragen, verhuuraanvragen,
              nieuwsbriefinschrijvingen, online bestellingen van cadeaubonnen en aankopen van
              eventtickets via deze website.
            </p>
          </article>

          <article className="legal-card">
            <h2>3. Informatieve inhoud</h2>
            <p>
              We doen redelijke inspanningen om de informatie op deze website correct, actueel en
              volledig te houden. Toch kunnen prijzen, beschikbaarheden, uren, eventinformatie en
              andere details op elk moment wijzigen. Kennelijke fouten of vergissingen binden ons
              niet.
            </p>
          </article>

          <article className="legal-card">
            <h2>4. Reservaties en aanvragen</h2>
            <ul>
              <li>
                Een reservatieaanvraag via de website is pas definitief zodra die door In den
                Boule is bevestigd.
              </li>
              <li>
                Een contact- of verhuuraanvraag geldt enkel als verzoek om informatie of offerte en
                creëert op zich nog geen bindende overeenkomst.
              </li>
              <li>
                We mogen aanvragen weigeren of bijkomende informatie vragen wanneer dat nodig is
                voor planning, capaciteit, veiligheid of correcte dienstverlening.
              </li>
            </ul>
          </article>

          <article className="legal-card">
            <h2>5. Events en tickets</h2>
            <ul>
              <li>
                Eventinformatie, beschikbaarheid, tickettypes en prijzen worden gecommuniceerd op
                de eventpagina of via de gekoppelde checkoutflow.
              </li>
              <li>
                Een ticketbestelling is pas afgerond nadat de betaling succesvol werd verwerkt.
              </li>
              <li>
                Voor events met beperkte capaciteit kan beschikbaarheid op elk moment wijzigen.
              </li>
              <li>
                Voor privé-events, presales of met wachtwoord beveiligde events mag toegang worden
                beperkt tot genodigden of personen met geldige toegangsgegevens.
              </li>
            </ul>
            <p>
              Voor vrijetijdsdiensten die op een bepaalde datum of binnen een bepaalde periode
              moeten worden geleverd, kan het wettelijke herroepingsrecht volgens het toepasselijke
              consumentenrecht uitgesloten zijn. Bij twijfel geldt steeds de dwingende wetgeving.
            </p>
          </article>

          <article className="legal-card">
            <h2>6. Cadeaubonnen</h2>
            <ul>
              <li>
                Cadeaubonnen worden aangeboden volgens de bedragen en flow die op de site worden
                vermeld.
              </li>
              <li>
                Een online bestelling van een cadeaubon is pas verwerkt na succesvolle betaling.
              </li>
              <li>
                Bijkomende gebruiksvoorwaarden, geldigheidsduur of praktische inwisselregels kunnen
                op de cadeaubon zelf of bij de bevestiging worden vermeld.
              </li>
            </ul>
          </article>

          <article className="legal-card">
            <h2>7. Betalingen</h2>
            <p>
              Online betalingen verlopen via Mollie. Wanneer je betaalt, word je doorgestuurd naar
              de checkoutomgeving van Mollie. Mollie verwerkt betaalgegevens volgens zijn eigen
              voorwaarden en privacyverklaring.
            </p>
            <p>
              In den Boule ontvangt via de website enkel de gegevens die nodig zijn om de
              bestelling, aanvraag of opvolging correct af te handelen.
            </p>
          </article>

          <article className="legal-card">
            <h2>8. Intellectuele eigendom</h2>
            <p>
              De inhoud van deze website, waaronder teksten, beelden, branding, logo&apos;s, lay-out
              en andere elementen, is beschermd door intellectuele eigendomsrechten. Zonder
              voorafgaande schriftelijke toestemming mag die inhoud niet worden gekopieerd,
              verspreid of hergebruikt, behalve voor strikt persoonlijk en niet-commercieel
              gebruik.
            </p>
          </article>

          <article className="legal-card">
            <h2>9. Aansprakelijkheid</h2>
            <p>
              Voor zover wettelijk toegestaan zijn we niet aansprakelijk voor indirecte schade,
              gevolgschade, winstderving, dataverlies of schade die voortvloeit uit het gebruik van
              de website, externe platformen of tijdelijke onbeschikbaarheid van de site.
            </p>
            <p>
              Deze beperking geldt niet wanneer aansprakelijkheid wettelijk niet kan worden
              uitgesloten, bijvoorbeeld bij opzet, zware fout of andere dwingende wettelijke
              uitzonderingen.
            </p>
          </article>

          <article className="legal-card">
            <h2>10. Externe diensten en links</h2>
            <p>
              Deze website kan linken naar of samenwerken met externe diensten zoals Mollie,
              Supabase, Sanity, Hostinger, OpenStreetMap of later Google Tag Manager. Voor de
              dienstverlening van die externe partijen kunnen hun eigen voorwaarden en
              privacyverklaringen gelden.
            </p>
          </article>

          <article className="legal-card">
            <h2>11. Privacy en cookies</h2>
            <p>
              Meer informatie over de verwerking van persoonsgegevens en het gebruik van cookies
              vind je in het <a href="/privacy">privacybeleid</a> en het{" "}
              <a href="/cookiebeleid">cookiebeleid</a>.
            </p>
          </article>

          <article className="legal-card">
            <h2>12. Toepasselijk recht en bevoegde rechtbank</h2>
            <p>
              Op deze website en deze voorwaarden is Belgisch recht van toepassing. Geschillen
              worden bij voorkeur eerst minnelijk besproken. Indien nodig worden ze voorgelegd aan
              de bevoegde rechtbanken volgens de wettelijk geldende regels.
            </p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
