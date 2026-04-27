import { cookies } from "next/headers";
import { PageHero } from "@/components/page-hero";
import { ReservationAdminAccessForm } from "@/components/reservation-admin-access-form";
import { ReservationAdminBoard } from "@/components/reservation-admin-board";
import { SiteShell } from "@/components/site-shell";
import { env } from "@/lib/env";
import {
  RESERVATION_ADMIN_COOKIE_NAME,
  hasValidReservationAdminAccess
} from "@/lib/reservation-admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ReservationAdminPage() {
  const cookieStore = await cookies();
  const hasAccess = hasValidReservationAdminAccess(
    cookieStore.get(RESERVATION_ADMIN_COOKIE_NAME)?.value,
    env.reservationAdminAccessCode
  );

  let reservations: Array<{
    id: string;
    created_at: string;
    reservation_date: string;
    reservation_time: string;
    party_size: string;
    name: string;
    email: string;
    note?: string | null;
    status?: string | null;
    handled_at?: string | null;
    handled_by?: string | null;
    admin_note?: string | null;
  }> = [];

  if (hasAccess) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("reservation_requests")
      .select("*")
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true });

    reservations = data || [];
  }

  return (
    <SiteShell ctaHref="/reservatie" ctaLabel="Terug naar reservatie">
      <PageHero
        eyebrow="Reservatie admin"
        title="Volg reservaties intern op."
        intro="Nieuwe aanvragen komen hier binnen vanuit de website. Je kunt ze hier opvolgen, bevestigen en intern noteren wie ze heeft afgehandeld."
      />

      <section className="section venue-section">
        {!hasAccess ? (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <h3>Beveiligde admintool</h3>
              <p>
                Deze reservatie-inbox is beschermd. Geef de interne admincode in om reservaties te bekijken en op te volgen.
              </p>
            </article>
            <article className="venue-panel">
              <ReservationAdminAccessForm />
            </article>
          </div>
        ) : (
          <ReservationAdminBoard reservations={reservations} />
        )}
      </section>
    </SiteShell>
  );
}
