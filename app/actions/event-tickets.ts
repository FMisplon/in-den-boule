"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CHECK_IN_COOKIE_NAME, createCheckInAccessToken, hasValidCheckInAccess } from "@/lib/check-in-access";
import { env } from "@/lib/env";
import { normalizeTicketScanValue, resolveCheckInStatus } from "@/lib/event-tickets";
import { readString } from "@/lib/forms";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CheckInState = {
  success: boolean;
  message: string;
  resultStatus?: "valid" | "used" | "invalid" | "refunded";
  eventTitle?: string;
  ticketTypeTitle?: string;
  customerName?: string;
  ticketCode?: string;
  checkedInAt?: string;
};

export const idleCheckInState: CheckInState = {
  success: false,
  message: ""
};

function canAccessCheckIn(cookieValue: string | undefined) {
  return hasValidCheckInAccess(cookieValue, env.checkInAccessCode);
}

export async function unlockCheckInAccess(_prevState: CheckInState, formData: FormData): Promise<CheckInState> {
  const accessCode = readString(formData, "access_code");

  if (!env.checkInAccessCode) {
    redirect("/check-in");
  }

  if (!accessCode || accessCode !== env.checkInAccessCode) {
    return {
      success: false,
      message: "De staffcode klopt niet."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(CHECK_IN_COOKIE_NAME, createCheckInAccessToken(accessCode), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.appUrl.startsWith("https://"),
    path: "/check-in",
    maxAge: 60 * 60 * 12
  });

  redirect("/check-in");
}

export async function checkInEventTicket(
  _prevState: CheckInState,
  formData: FormData
): Promise<CheckInState> {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(CHECK_IN_COOKIE_NAME)?.value;

  if (!canAccessCheckIn(accessCookie)) {
    return {
      success: false,
      message: "Geen toegang tot de check-in tool."
    };
  }

  const rawValue = readString(formData, "scan_value");
  const ticketCode = normalizeTicketScanValue(rawValue);

  if (!ticketCode) {
    return {
      success: false,
      message: "Scan of plak een geldige ticketcode of ticketlink."
    };
  }

  const supabase = createSupabaseServerClient();
  const { data: ticket, error: ticketError } = await supabase
    .from("event_tickets")
    .select("*")
    .eq("ticket_code", ticketCode)
    .maybeSingle();

  if (ticketError || !ticket) {
    return {
      success: false,
      message: "Ongeldig ticket. Deze code werd niet gevonden.",
      resultStatus: "invalid",
      ticketCode
    };
  }

  const { data: order, error: orderError } = await supabase
    .from("event_ticket_orders")
    .select("id,status")
    .eq("id", ticket.order_id)
    .maybeSingle();

  if (orderError || !order) {
    return {
      success: false,
      message: "Ticket gevonden, maar bijhorende bestelling ontbreekt.",
      resultStatus: "invalid",
      eventTitle: ticket.event_title,
      ticketTypeTitle: ticket.ticket_type_title,
      customerName: ticket.customer_name,
      ticketCode: ticket.ticket_code
    };
  }

  const status = resolveCheckInStatus(ticket, order.status);

  if (status === "refunded") {
    return {
      success: false,
      message: "Dit ticket hoort bij een geannuleerde of terugbetaalde bestelling.",
      resultStatus: "refunded",
      eventTitle: ticket.event_title,
      ticketTypeTitle: ticket.ticket_type_title,
      customerName: ticket.customer_name,
      ticketCode: ticket.ticket_code
    };
  }

  if (status === "invalid") {
    return {
      success: false,
      message: "Dit ticket is niet geldig voor check-in.",
      resultStatus: "invalid",
      eventTitle: ticket.event_title,
      ticketTypeTitle: ticket.ticket_type_title,
      customerName: ticket.customer_name,
      ticketCode: ticket.ticket_code
    };
  }

  if (status === "used") {
    return {
      success: false,
      message: "Dit ticket werd al eerder ingecheckt.",
      resultStatus: "used",
      eventTitle: ticket.event_title,
      ticketTypeTitle: ticket.ticket_type_title,
      customerName: ticket.customer_name,
      ticketCode: ticket.ticket_code,
      checkedInAt: ticket.checked_in_at || undefined
    };
  }

  const checkedInAt = new Date().toISOString();
  const { data: updatedTicket, error: updateError } = await supabase
    .from("event_tickets")
    .update({ checked_in_at: checkedInAt })
    .eq("id", ticket.id)
    .is("checked_in_at", null)
    .select("*")
    .maybeSingle();

  if (updateError) {
    return {
      success: false,
      message: "Check-in kon niet opgeslagen worden. Probeer opnieuw.",
      resultStatus: "invalid",
      eventTitle: ticket.event_title,
      ticketTypeTitle: ticket.ticket_type_title,
      customerName: ticket.customer_name,
      ticketCode: ticket.ticket_code
    };
  }

  if (!updatedTicket) {
    const { data: latestTicket } = await supabase
      .from("event_tickets")
      .select("checked_in_at")
      .eq("id", ticket.id)
      .maybeSingle();

    return {
      success: false,
      message: "Dit ticket werd intussen al ingecheckt.",
      resultStatus: "used",
      eventTitle: ticket.event_title,
      ticketTypeTitle: ticket.ticket_type_title,
      customerName: ticket.customer_name,
      ticketCode: ticket.ticket_code,
      checkedInAt: latestTicket?.checked_in_at || undefined
    };
  }

  return {
    success: true,
    message: "Ticket geldig. Check-in geregistreerd.",
    resultStatus: "valid",
    eventTitle: updatedTicket.event_title,
    ticketTypeTitle: updatedTicket.ticket_type_title,
    customerName: updatedTicket.customer_name,
    ticketCode: updatedTicket.ticket_code,
    checkedInAt: updatedTicket.checked_in_at || undefined
  };
}
