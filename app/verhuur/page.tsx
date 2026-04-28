import { PageHero } from "@/components/page-hero";
import { RichTextContent } from "@/components/rich-text-content";
import { SiteShell } from "@/components/site-shell";
import { VenueInquiryForm } from "@/components/venue-inquiry-form";
import { getPageHeroImage, getVenuePage } from "@/lib/sanity/loaders";

export const revalidate = 60;

export default async function VerhuurPage() {
  const [heroImage, venuePage] = await Promise.all([getPageHeroImage("verhuur"), getVenuePage()]);

  if (!venuePage) {
    return (
      <SiteShell ctaHref="/contact" ctaLabel="Vraag offerte aan">
        <PageHero
          eyebrow="Verhuur"
          title="Verhuurcontent nog niet gepubliceerd."
          intro="Publiceer het document 'Verhuurpagina' in Sanity om deze pagina te vullen."
          imageUrl={heroImage?.imageUrl}
          imageAlt={heroImage?.alt}
        />
        <section className="section venue-section">
          <article className="empty-state-card">
            <span>Sanity vereist</span>
            <h2>De verhuurpagina leest nu uitsluitend uit Sanity.</h2>
            <p>
              Voeg of publiceer het document <strong>Verhuurpagina</strong> in Sanity om de
              inhoud hier live te tonen.
            </p>
          </article>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell ctaHref="/contact" ctaLabel="Vraag offerte aan">
      <PageHero
        eyebrow={venuePage.heroEyebrow}
        title={venuePage.heroTitle}
        intro={venuePage.heroIntro}
        imageUrl={heroImage?.imageUrl}
        imageAlt={heroImage?.alt}
      />

      <section className="section venue-section">
        <div className="venue-layout">
          <article className="venue-panel">
            <h3>{venuePage.overviewTitle}</h3>
            {venuePage.overviewBodyRich?.length ? (
              <RichTextContent value={venuePage.overviewBodyRich} className="rich-text-content" />
            ) : (
              <p>{venuePage.overviewBody}</p>
            )}
            {venuePage.overviewBullets.length ? (
              <ul>
                {venuePage.overviewBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </article>
          <article className="venue-panel venue-panel-accent">
            <h3>{venuePage.formatsTitle}</h3>
            <p>{venuePage.formatsSummary}</p>
            <div className="venue-capacity">
              {venuePage.capacities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            {venuePage.formatsNoteRich?.length ? (
              <RichTextContent value={venuePage.formatsNoteRich} className="rich-text-content" />
            ) : (
              <p style={{ marginTop: "1rem" }}>{venuePage.formatsNote}</p>
            )}
          </article>
        </div>
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel">
            <p className="eyebrow">{venuePage.inquiryEyebrow}</p>
            <h3>{venuePage.inquiryTitle}</h3>
            {venuePage.inquiryBodyRich?.length ? (
              <RichTextContent value={venuePage.inquiryBodyRich} className="rich-text-content" />
            ) : (
              <p>{venuePage.inquiryBody}</p>
            )}
          </article>
          <VenueInquiryForm />
        </div>
      </section>
    </SiteShell>
  );
}
