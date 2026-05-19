import { cookies } from "next/headers";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { VenueAdminAccessForm } from "@/components/venue-admin-access-form";
import { VenueAdminBoard } from "@/components/venue-admin-board";
import { env } from "@/lib/env";
import {
  VENUE_ADMIN_COOKIE_NAME,
  hasValidVenueAdminAccess
} from "@/lib/venue-admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default async function VenueAdminPage() {
  const cookieStore = await cookies();
  const hasAccess = hasValidVenueAdminAccess(
    cookieStore.get(VENUE_ADMIN_COOKIE_NAME)?.value,
    env.reservationAdminAccessCode
  );

  let inquiries: Array<{
    id: string;
    created_at: string;
    name: string;
    email: string;
    event_type: string;
    preferred_date: string;
    guest_count: string;
    message?: string | null;
    status?: string | null;
    handled_at?: string | null;
    handled_by?: string | null;
    admin_note?: string | null;
  }> = [];

  if (hasAccess) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("venue_requests")
      .select("*")
      .order("preferred_date", { ascending: true })
      .order("created_at", { ascending: false });

    inquiries = data || [];
  }

  return (
    <SiteShell ctaHref="/verhuur" ctaLabel="Terug naar verhuur">
      <PageHero
        eyebrow="Verhuur admin"
        title="Volg offerteaanvragen intern op."
        intro="Nieuwe verhuur- en offerteaanvragen komen hier binnen vanuit de website. Je kunt ze hier opvolgen, offreren en intern noteren wie ze heeft afgehandeld."
      />

      <section className="section venue-section">
        {!hasAccess ? (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <h3>Beveiligde admintool</h3>
              <p>
                Deze verhuur-inbox is beschermd. Geef de interne admincode in om offerteaanvragen te bekijken en op te volgen.
              </p>
            </article>
            <article className="venue-panel">
              <VenueAdminAccessForm />
            </article>
          </div>
        ) : (
          <VenueAdminBoard inquiries={inquiries} />
        )}
      </section>
    </SiteShell>
  );
}
