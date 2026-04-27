import { randomBytes } from "node:crypto";
import { env } from "@/lib/env";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

export type EventTicketOrderRecord = {
  id: string;
  event_slug: string;
  event_title: string;
  ticket_type_key: string;
  ticket_type_title: string;
  quantity: number;
  customer_name: string;
  customer_email: string;
  total_amount_cents: number;
  unit_price_cents: number;
  currency: string;
  status: string;
  tickets_issued_at?: string | null;
  confirmation_sent_at?: string | null;
};

export type EventTicketRecord = {
  id: string;
  order_id: string;
  event_slug: string;
  event_title: string;
  ticket_type_key: string;
  ticket_type_title: string;
  customer_name: string;
  customer_email: string;
  ticket_code: string;
  qr_payload: string;
  status: string;
  checked_in_at?: string | null;
  created_at?: string;
};

function createTicketCode() {
  return `tkt_${randomBytes(12).toString("hex")}`;
}

export function buildTicketUrl(ticketCode: string) {
  return `${env.appUrl.replace(/\/$/, "")}/tickets/${ticketCode}`;
}

export function normalizeTicketScanValue(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const segments = parsed.pathname.split("/").filter(Boolean);
      const maybeCode = segments.at(-1);
      return maybeCode?.trim() || "";
    } catch {
      return trimmed;
    }
  }

  return trimmed.replace(/^\/?tickets\//, "").trim();
}

export function resolveCheckInStatus(ticket: EventTicketRecord, orderStatus: string) {
  if (ticket.status !== "valid") {
    return "invalid" as const;
  }

  if (["refunded", "charged_back", "canceled", "expired", "failed"].includes(orderStatus)) {
    return "refunded" as const;
  }

  if (orderStatus !== "paid") {
    return "invalid" as const;
  }

  if (ticket.checked_in_at) {
    return "used" as const;
  }

  return "valid" as const;
}

export async function ensureEventTicketsIssued(
  supabase: SupabaseServerClient,
  order: EventTicketOrderRecord
) {
  if (order.status !== "paid") {
    return [] as EventTicketRecord[];
  }

  const { data: existingTickets, error: existingError } = await supabase
    .from("event_tickets")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (existingError) {
    throw new Error(`Tickets ophalen mislukt: ${existingError.message}`);
  }

  const tickets = (existingTickets || []) as EventTicketRecord[];
  const missingCount = Math.max(order.quantity - tickets.length, 0);

  if (missingCount > 0) {
    const inserts = Array.from({ length: missingCount }, () => {
      const ticketCode = createTicketCode();
      return {
        order_id: order.id,
        event_slug: order.event_slug,
        event_title: order.event_title,
        ticket_type_key: order.ticket_type_key,
        ticket_type_title: order.ticket_type_title,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        ticket_code: ticketCode,
        qr_payload: buildTicketUrl(ticketCode),
        status: "valid"
      };
    });

    const { data: insertedTickets, error: insertError } = await supabase
      .from("event_tickets")
      .insert(inserts)
      .select("*");

    if (insertError) {
      throw new Error(`Tickets aanmaken mislukt: ${insertError.message}`);
    }

    tickets.push(...((insertedTickets || []) as EventTicketRecord[]));
  }

  if (!order.tickets_issued_at) {
    await supabase
      .from("event_ticket_orders")
      .update({ tickets_issued_at: new Date().toISOString() })
      .eq("id", order.id);
  }

  return tickets;
}
