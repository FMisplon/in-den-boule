import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPageHeroImage, getSiteSettings } from "@/lib/sanity/loaders";
import { site } from "@/lib/site-data";

const lastUpdated = "27 april 2026";

export const revalidate = 60;

export default async function CookiePolicyPage() {
  const [heroImage, siteSettings] = await Promise.all([
    getPageHeroImage("cookiebeleid"),
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
        eyebrow="Cookiebeleid"
        title="Hoe In den Boule cookies en gelijkaardige technieken gebruikt."
        intro="Dit cookiebeleid legt uit welke cookies of gelijkaardige technieken via deze website kunnen worden gebruikt, waarvoor ze dienen en hoe je daar controle over houdt."
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section legal-section">
        <div className="legal-layout">
          <article className="legal-card legal-card-highlight">
            <p className="legal-kicker">Laatste update</p>
            <p>{lastUpdated}</p>
            <p className="legal-meta">
              Belangrijk: Google Tag Manager fungeert hier als container. Niet-noodzakelijke tags
              zoals Google Analytics 4, Google Ads en Meta Pixel worden alleen geladen nadat een
              bezoeker daarvoor toestemming geeft via de cookiebanner.
            </p>
          </article>

          <article className="legal-card">
            <h2>1. Wie is verantwoordelijk?</h2>
            <p>
              Deze website wordt uitgebaat onder de naam <strong>{legalIdentity}</strong>,
              bereikbaar via {site.address} en{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
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
                Juridische identificatie van de uitbater, maatschappelijke zetel, KBO-nummer en
                btw-nummer moeten nog definitief worden aangevuld in deze tekst.
              </p>
            )}
          </article>

          <article className="legal-card">
            <h2>2. Wat zijn cookies?</h2>
            <p>
              Cookies zijn kleine tekstbestanden die op je toestel kunnen worden geplaatst wanneer
              je een website bezoekt. Ze helpen bijvoorbeeld om een website technisch te laten
              werken, je voorkeuren te onthouden of formulieren en beveiligde toegang correct te
              laten functioneren.
            </p>
          </article>

          <article className="legal-card">
            <h2>3. Welke cookies of technieken gebruiken we vandaag?</h2>
            <h3>Strikt noodzakelijke of functionele cookies</h3>
            <ul>
              <li>
                Technische cookies of tijdelijke sessiegegevens die nodig zijn om de Next.js-site,
                formulieren en beveiligingsfuncties correct te laten werken.
              </li>
              <li>
                Een functionele toegangscookie voor afgeschermde eventpagina&apos;s wanneer een
                bezoeker een geldig eventwachtwoord ingeeft. Op basis van de huidige code wordt die
                cookie maximaal 8 uur bewaard.
              </li>
              <li>
                Technische infrastructuurcookies die kunnen voortkomen uit hosting via Hostinger of
                uit de onderliggende webapplicatie, voor zover nodig voor beveiliging,
                sessiebeheer en performantie.
              </li>
            </ul>
            <h3>Externe diensten binnen de gebruiksflow</h3>
            <ul>
              <li>
                Voor betalingen word je doorgestuurd naar Mollie. Op dat moment werkt ook het
                privacy- en cookiebeleid van Mollie op de Mollie-checkoutomgeving.
              </li>
              <li>
                Op de contactpagina wordt een kaart van OpenStreetMap ingeladen. Daardoor kan er
                een verzoek naar OpenStreetMap of aanverwante kaartdiensten worden verstuurd.
              </li>
            </ul>
          </article>

          <article className="legal-card">
            <h2>4. Google Tag Manager en analytics</h2>
            <p>
              Google Tag Manager is het systeem waarmee tags centraal kunnen worden beheerd. Via
              die container kunnen, afhankelijk van de ingestelde toestemming, onder meer Google
              Analytics 4, Google Ads en Meta Pixel worden geladen.
            </p>
            <p>
              Google Analytics 4 kan worden gebruikt om pageviews en basisconversies te meten,
              zoals reservatieaanvragen, nieuwsbriefinschrijvingen en succesvolle ticket- of
              cadeaubonaankopen. Google Ads en Meta Pixel kunnen worden gebruikt voor
              advertentiemeting, remarketing, doelgroepopbouw en campagne-attributie.
            </p>
            <p>
              Deze tags worden alleen geactiveerd nadat de bezoeker daarvoor toestemming heeft
              gegeven. Zonder toestemming blijven niet-noodzakelijke analytics- en marketingtags
              geblokkeerd.
            </p>
          </article>

          <article className="legal-card">
            <h2>5. Rechtsgrond voor niet-noodzakelijke cookies</h2>
            <p>
              Voor strikt noodzakelijke cookies baseren we ons op het technisch noodzakelijke
              karakter van die cookies. Voor niet-noodzakelijke cookies, zoals analyse-,
              marketing- of advertentiecookies, zullen we waar nodig voorafgaande toestemming
              vragen voordat die technologie actief wordt.
            </p>
          </article>

          <article className="legal-card">
            <h2>6. Bewaartermijnen</h2>
            <p>
              We proberen de levensduur van cookies te beperken tot wat redelijk nodig is voor hun
              doel. Tijdelijke of sessiegerelateerde cookies verlopen normaal bij het afsluiten van
              de sessie of kort daarna. De eventtoegangscookie voor afgeschermde events wordt in de
              huidige implementatie maximaal 8 uur bijgehouden.
            </p>
            <p>
              Voor analytics- en marketingcookies of gelijkaardige trackingtechnieken via Google of
              Meta kunnen de concrete bewaartermijnen verschillen naargelang de ingestelde tags,
              advertentieproducten en browserinstellingen. Waar relevant worden die termijnen via
              dit beleid, de banner of de documentatie van de betrokken leverancier verduidelijkt.
            </p>
          </article>

          <article className="legal-card">
            <h2>7. Hoe kan je cookies beheren?</h2>
            <ul>
              <li>Je kan cookies verwijderen of blokkeren via de instellingen van je browser.</li>
              <li>
                Hou er rekening mee dat bepaalde delen van de website dan mogelijk minder goed
                werken, vooral functies rond formulieren, beveiligde toegang en checkoutflows.
              </li>
              <li>
                Via de cookiebanner en de knop cookie-instellingen op de website kan je je keuze
                voor analytics- en marketingcookies later opnieuw aanpassen.
              </li>
            </ul>
          </article>

          <article className="legal-card">
            <h2>8. Vragen</h2>
            <p>
              Vragen over dit cookiebeleid kan je sturen naar{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            </p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
