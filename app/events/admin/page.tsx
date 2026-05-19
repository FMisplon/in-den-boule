import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { EventAdminAccessForm } from "@/components/event-admin-access-form";
import {
  EventAdminBoard,
  type EventAdminEventSummary
} from "@/components/event-admin-board";
import { canAccessEventAdmin } from "@/app/actions/event-admin";
import { getEvents } from "@/lib/sanity/loaders";
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

type EventOrderRecord = {
  id: string;
  created_at: string;
  event_slug: string;
  event_title: string;
  ticket_type_key: string;
  ticket_type_title: string;
  quantity: number;
  customer_name: string;
  customer_email: string;
  total_amount_cents: number;
  currency: string;
  status: string;
};

type EventTicketRecord = {
  id: string;
  order_id: string;
  event_slug: string;
  ticket_type_key: string;
  ticket_type_title: string;
  checked_in_at?: string | null;
};

export default async function EventsAdminPage() {
  const hasAccess = await canAccessEventAdmin();
  let events: EventAdminEventSummary[] = [];

  if (hasAccess) {
    const [sanityEvents, ordersResult, ticketsResult] = await Promise.all([
      getEvents(),
      createSupabaseServerClient()
        .from("event_ticket_orders")
        .select("*")
        .order("created_at", { ascending: false }),
      createSupabaseServerClient()
        .from("event_tickets")
        .select("id,order_id,event_slug,ticket_type_key,ticket_type_title,checked_in_at")
    ]);

    const orders = (ordersResult.data || []) as EventOrderRecord[];
    const tickets = (ticketsResult.data || []) as EventTicketRecord[];
    const sanityEventMap = new Map(sanityEvents.map((event) => [event.slug, event]));

    const eventSlugSet = new Set([
      ...sanityEvents.map((event) => event.slug),
      ...orders.map((order) => order.event_slug)
    ]);

    events = Array.from(eventSlugSet)
      .map((slug) => {
        const eventOrders = orders.filter((order) => order.event_slug === slug);
        const paidOrders = eventOrders.filter((order) => order.status === "paid");
        const pendingOrders = eventOrders.filter((order) => order.status === "pending");
        const refundedOrders = eventOrders.filter((order) =>
          ["refunded", "charged_back", "canceled", "expired", "failed"].includes(order.status)
        );
        const eventTickets = tickets.filter((ticket) => ticket.event_slug === slug);
        const soldCount = paidOrders.reduce((sum, order) => sum + order.quantity, 0);
        const checkedInCount = eventTickets.filter((ticket) => Boolean(ticket.checked_in_at)).length;
        const revenueCents = paidOrders.reduce((sum, order) => sum + order.total_amount_cents, 0);
        const sanityEvent = sanityEventMap.get(slug);

        const soldByType = new Map<string, { title: string; soldCount: number; checkedInCount: number }>();

        for (const order of paidOrders) {
          const entry = soldByType.get(order.ticket_type_key || order.ticket_type_title) || {
            title: order.ticket_type_title,
            soldCount: 0,
            checkedInCount: 0
          };
          entry.soldCount += order.quantity;
          soldByType.set(order.ticket_type_key || order.ticket_type_title, entry);
        }

        for (const ticket of eventTickets) {
          const key = ticket.ticket_type_key || ticket.ticket_type_title;
          const entry = soldByType.get(key) || {
            title: ticket.ticket_type_title,
            soldCount: 0,
            checkedInCount: 0
          };
          if (ticket.checked_in_at) {
            entry.checkedInCount += 1;
          }
          soldByType.set(key, entry);
        }

        const sanityTicketTypes = sanityEvent?.ticketTypes || [];
        const ticketTypes = [
          ...sanityTicketTypes.map((ticketType) => {
            const sold = soldByType.get(ticketType.key);
            return {
              key: ticketType.key,
              title: ticketType.title,
              soldCount: sold?.soldCount || 0,
              checkedInCount: sold?.checkedInCount || 0,
              configuredCapacity: ticketType.availableQuantity
            };
          }),
          ...Array.from(soldByType.entries())
            .filter(([key]) => !sanityTicketTypes.some((ticketType) => ticketType.key === key))
            .map(([key, value]) => ({
              key,
              title: value.title,
              soldCount: value.soldCount,
              checkedInCount: value.checkedInCount,
              configuredCapacity: undefined
            }))
        ];

        const eventTitle = sanityEvent?.title || paidOrders[0]?.event_title || eventOrders[0]?.event_title || slug;
        const dateLabel = sanityEvent?.dateLabel || "Datum niet beschikbaar";
        const salesStatus = sanityEvent?.salesStatus;

        return {
          slug,
          title: eventTitle,
          dateLabel,
          salesStatus,
          revenueCents,
          revenueCurrency: paidOrders[0]?.currency || "EUR",
          soldCount,
          checkedInCount,
          paidOrderCount: paidOrders.length,
          pendingOrderCount: pendingOrders.length,
          refundedOrderCount: refundedOrders.length,
          ticketTypes,
          orders: eventOrders
            .map((order) => ({
              id: order.id,
              created_at: order.created_at,
              customer_name: order.customer_name,
              customer_email: order.customer_email,
              ticket_type_title: order.ticket_type_title,
              quantity: order.quantity,
              total_amount_cents: order.total_amount_cents,
              currency: order.currency,
              status: order.status,
              ticketsIssued: eventTickets.filter((ticket) => ticket.order_id === order.id).length,
              checkedInCount: eventTickets.filter(
                (ticket) => ticket.order_id === order.id && Boolean(ticket.checked_in_at)
              ).length
            }))
            .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
        };
      })
      .filter((event) => event.paidOrderCount || event.pendingOrderCount || event.refundedOrderCount)
      .sort((left, right) => {
        if (left.soldCount !== right.soldCount) {
          return right.soldCount - left.soldCount;
        }

        return left.title.localeCompare(right.title, "nl");
      });
  }

  return (
    <SiteShell ctaHref="/events" ctaLabel="Terug naar events">
      <PageHero
        eyebrow="Events admin"
        title="Volg ticketverkoop en check-ins intern op."
        intro="Deze inbox bundelt ticketverkoop uit Supabase met eventconfiguratie uit Sanity, zodat je per event ziet hoeveel tickets verkocht, uitgegeven en ingecheckt zijn."
      />

      <section className="section venue-section">
        {!hasAccess ? (
          <div className="venue-layout venue-form-layout">
            <article className="venue-panel venue-panel-accent">
              <h3>Beveiligde admintool</h3>
              <p>
                Deze events-inbox is beschermd. Geef de interne admincode in om verkoop en check-ins per event te bekijken.
              </p>
            </article>
            <article className="venue-panel">
              <EventAdminAccessForm />
            </article>
          </div>
        ) : (
          <EventAdminBoard events={events} />
        )}
      </section>
    </SiteShell>
  );
}
