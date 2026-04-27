import { cookies } from "next/headers";
import { CheckInAccessForm } from "@/components/check-in-access-form";
import { CheckInScanner } from "@/components/check-in-scanner";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { CHECK_IN_COOKIE_NAME, hasValidCheckInAccess } from "@/lib/check-in-access";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const cookieStore = await cookies();
  const hasAccess = hasValidCheckInAccess(
    cookieStore.get(CHECK_IN_COOKIE_NAME)?.value,
    env.checkInAccessCode
  );

  return (
    <SiteShell ctaHref="/events" ctaLabel="Terug naar events">
      <PageHero
        eyebrow="Staff check-in"
        title="Controleer tickets aan de deur."
        intro="Scan de QR-code of plak de ticketlink. De tool blokkeert dubbele scans en toont meteen of een ticket geldig, al gebruikt of ongeldig is."
      />

      <section className="section venue-section">
        {!hasAccess ? (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <h3>Beveiligde stafftool</h3>
              <p>
                Deze check-in pagina is beschermd. Geef de interne staffcode in om tickets te kunnen scannen.
              </p>
            </article>
            <article className="venue-panel">
              <CheckInAccessForm />
            </article>
          </div>
        ) : (
          <CheckInScanner requiresAccessCode={Boolean(env.checkInAccessCode)} />
        )}
      </section>
    </SiteShell>
  );
}
