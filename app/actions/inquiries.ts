"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { createMolliePayment } from "@/lib/mollie";
import { createEventAccessToken, getEventAccessCookieName } from "@/lib/event-access";
import { readString, type FormStatus } from "@/lib/forms";
import { env } from "@/lib/env";
import { sendFormEmails } from "@/lib/mailer";
import { isReservationDateAllowed, isReservationTimeAllowed } from "@/lib/reservations";
import { getEventBySlug } from "@/lib/sanity/loaders";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getSupabaseForAction() {
  try {
    return createSupabaseServerClient();
  } catch {
    return null;
  }
}

function wantsNewsletter(formData: FormData) {
  return formData.get("newsletter_opt_in") === "yes";
}

async function addToNewsletterList(email: string, source: string) {
  const supabase = getSupabaseForAction();

  if (!supabase || !email) {
    return;
  }

  const { error } = await supabase.from("newsletter_signups").insert({
    email,
    source,
    status: "subscribed"
  });

  if (error && error.code !== "23505") {
    console.error("[Newsletter] Failed to store opt-in", error);
  }
}

export async function submitEventWaitlist(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const eventSlug = readString(formData, "event_slug");
  const eventTitle = readString(formData, "event_title");
  const name = readString(formData, "name");
  const email = readString(formData, "email");

  if (!eventSlug || !eventTitle || !name || !email) {
    return {
      success: false,
      message: "Vul naam en e-mail in om je op de wachtlijst te zetten."
    };
  }

  const supabase = getSupabaseForAction();

  if (!supabase) {
    return { success: false, message: "Serverconfiguratie ontbreekt voor de wachtlijst." };
  }

  const { error } = await supabase.from("event_waitlist_signups").insert({
    event_slug: eventSlug,
    event_title: eventTitle,
    name,
    email
  });

  if (error?.code === "23505") {
    return {
      success: true,
      message: "Dit e-mailadres staat al op de wachtlijst voor dit event."
    };
  }

  if (error) {
    return {
      success: false,
      message: "De wachtlijstinschrijving kon niet opgeslagen worden. Probeer opnieuw."
    };
  }

  const mailResult = await sendFormEmails({
    kind: "event-waitlist",
    name,
    email,
    eventTitle
  });

  if (wantsNewsletter(formData)) {
    await addToNewsletterList(email, "event-waitlist");
  }

  return {
    success: true,
    message: mailResult.warning
      ? `Je staat op de wachtlijst. ${mailResult.warning}`
      : "Je staat op de wachtlijst. We stuurden ook een bevestiging per e-mail."
  };
}

export async function submitReservation(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const reservationDate = readString(formData, "reservation_date");
  const reservationTime = readString(formData, "reservation_time");
  const partySize = readString(formData, "party_size");
  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const note = readString(formData, "note");

  if (!reservationDate || !reservationTime || !partySize || !name || !email) {
    return { success: false, message: "Vul datum, uur, aantal personen, naam en e-mail in." };
  }

  if (!isReservationDateAllowed(reservationDate)) {
    return {
      success: false,
      message: "Op die dag nemen we geen reservaties aan. Kies een open dag."
    };
  }

  if (!isReservationTimeAllowed(reservationDate, reservationTime)) {
    return {
      success: false,
      message: "Dat uur ligt buiten de openingsuren. Kies een geldig tijdslot."
    };
  }

  const supabase = getSupabaseForAction();

  if (!supabase) {
    return { success: false, message: "Serverconfiguratie ontbreekt voor reservaties." };
  }

  const { error } = await supabase.from("reservation_requests").insert({
    reservation_date: reservationDate,
    reservation_time: reservationTime,
    party_size: partySize,
    name,
    email,
    note: note || null
  });

  if (error) {
    return { success: false, message: "Reservatie kon niet verzonden worden. Probeer opnieuw." };
  }

  const mailResult = await sendFormEmails({
    kind: "reservation",
    name,
    email,
    reservationDate,
    reservationTime,
    partySize,
    note: note || null
  });

  if (wantsNewsletter(formData)) {
    await addToNewsletterList(email, "reservation-form");
  }

  revalidatePath("/reservatie");
  return {
    success: true,
    message: mailResult.warning
      ? `Je reservatieaanvraag is goed ontvangen. ${mailResult.warning}`
      : "Je reservatieaanvraag is goed ontvangen. We stuurden ook een bevestiging per e-mail."
  };
}

export async function submitContact(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const subject = readString(formData, "subject");
  const message = readString(formData, "message");

  if (!name || !email || !subject || !message) {
    return { success: false, message: "Vul naam, e-mail, onderwerp en bericht in." };
  }

  const supabase = getSupabaseForAction();

  if (!supabase) {
    return { success: false, message: "Serverconfiguratie ontbreekt voor contactaanvragen." };
  }

  const { error } = await supabase.from("contact_requests").insert({
    name,
    email,
    subject,
    message
  });

  if (error) {
    return { success: false, message: "Je bericht kon niet verzonden worden. Probeer opnieuw." };
  }

  const mailResult = await sendFormEmails({
    kind: "contact",
    name,
    email,
    subject,
    message
  });

  if (wantsNewsletter(formData)) {
    await addToNewsletterList(email, "contact-form");
  }

  revalidatePath("/contact");
  return {
    success: true,
    message: mailResult.warning
      ? `Je bericht is goed ontvangen. ${mailResult.warning}`
      : "Je bericht is goed ontvangen. We stuurden ook een bevestiging per e-mail."
  };
}

export async function submitVenueInquiry(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const eventType = readString(formData, "event_type");
  const preferredDate = readString(formData, "preferred_date");
  const guestCount = readString(formData, "guest_count");
  const message = readString(formData, "message");

  if (!name || !email || !eventType || !preferredDate || !guestCount) {
    return {
      success: false,
      message: "Vul naam, e-mail, type event, gewenste datum en aantal gasten in."
    };
  }

  const supabase = getSupabaseForAction();

  if (!supabase) {
    return { success: false, message: "Serverconfiguratie ontbreekt voor offerteaanvragen." };
  }

  const { error } = await supabase.from("venue_requests").insert({
    name,
    email,
    event_type: eventType,
    preferred_date: preferredDate,
    guest_count: guestCount,
    message: message || null
  });

  if (error) {
    return { success: false, message: "De offerteaanvraag kon niet verzonden worden." };
  }

  const mailResult = await sendFormEmails({
    kind: "venue",
    name,
    email,
    eventType,
    preferredDate,
    guestCount,
    message: message || null
  });

  if (wantsNewsletter(formData)) {
    await addToNewsletterList(email, "venue-form");
  }

  revalidatePath("/verhuur");
  return {
    success: true,
    message: mailResult.warning
      ? `Je offerteaanvraag is goed ontvangen. ${mailResult.warning}`
      : "Je offerteaanvraag is goed ontvangen. We stuurden ook een bevestiging per e-mail."
  };
}

export async function submitNewsletterSignup(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const email = readString(formData, "email");
  const source = readString(formData, "source");

  if (!email) {
    return {
      success: false,
      message: "Vul een e-mailadres in om je in te schrijven."
    };
  }

  const supabase = getSupabaseForAction();

  if (!supabase) {
    return { success: false, message: "Serverconfiguratie ontbreekt voor nieuwsbriefinschrijvingen." };
  }

  const { error } = await supabase.from("newsletter_signups").insert({
    email,
    source: source || "website",
    status: "subscribed"
  });

  if (error?.code === "23505") {
    return {
      success: true,
      message: "Dit e-mailadres staat al op de nieuwsbrief."
    };
  }

  if (error) {
    return {
      success: false,
      message: "De inschrijving kon niet opgeslagen worden. Probeer opnieuw."
    };
  }

  const mailResult = await sendFormEmails({
    kind: "newsletter",
    email,
    source: source || "website"
  });

  revalidatePath("/");
  return {
    success: true,
    message: mailResult.warning
      ? `Je bent ingeschreven op de nieuwsbrief. ${mailResult.warning}`
      : "Je bent ingeschreven op de nieuwsbrief. We stuurden ook een bevestiging per e-mail."
  };
}

export async function createGiftCardPayment(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const purchaserName = readString(formData, "purchaser_name");
  const purchaserEmail = readString(formData, "purchaser_email");
  const recipientName = readString(formData, "recipient_name");
  const amountLabel = readString(formData, "amount");
  const personalMessage = readString(formData, "personal_message");

  const amountMap: Record<string, { cents: number; value: string }> = {
    "25": { cents: 2500, value: "25.00" },
    "50": { cents: 5000, value: "50.00" },
    "75": { cents: 7500, value: "75.00" },
    "100": { cents: 10000, value: "100.00" }
  };

  const selectedAmount = amountMap[amountLabel];
  const newsletterOptIn = wantsNewsletter(formData);

  if (!purchaserName || !purchaserEmail || !recipientName || !selectedAmount) {
    return {
      success: false,
      message: "Vul naam, e-mail, ontvanger en bedrag in."
    };
  }

  const supabase = getSupabaseForAction();

  if (!supabase) {
    return { success: false, message: "Serverconfiguratie ontbreekt voor cadeaubonnen." };
  }

  const { data: insertedOrder, error: insertError } = await supabase
    .from("gift_card_orders")
    .insert({
      purchaser_name: purchaserName,
      purchaser_email: purchaserEmail,
      recipient_name: recipientName,
      personal_message: personalMessage || null,
      amount_cents: selectedAmount.cents,
      currency: "EUR",
      status: "created"
    })
    .select("id")
    .single();

  if (insertError || !insertedOrder) {
    return {
      success: false,
      message: `Cadeaubonopslag mislukt${insertError?.message ? `: ${insertError.message}` : "."}`
    };
  }

  try {
    const payment = await createMolliePayment({
      amount: {
        currency: "EUR",
        value: selectedAmount.value
      },
      description: `In den Boule cadeaubon €${amountLabel}`,
      redirectUrl: `${env.appUrl}/shop/bedankt?order=${insertedOrder.id}`,
      metadata: {
        orderId: insertedOrder.id
      }
    });

    const { error: updateError } = await supabase
      .from("gift_card_orders")
      .update({
        mollie_payment_id: payment.id,
        status: "pending"
      })
      .eq("id", insertedOrder.id);

    if (updateError || !payment._links?.checkout?.href) {
      return {
        success: false,
        message: `Betaling kon niet correct voorbereid worden${
          updateError?.message ? `: ${updateError.message}` : "."
        }`
      };
    }

    if (newsletterOptIn) {
      await addToNewsletterList(purchaserEmail, "gift-card-checkout");
    }

    redirect(payment._links.checkout.href);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const detail =
      error instanceof Error && error.message ? ` (${error.message.slice(0, 160)})` : "";
    return {
      success: false,
      message: `De betaling kon niet gestart worden${detail}.`
    };
  }
}

export async function createEventTicketPayment(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const eventSlug = readString(formData, "event_slug");
  const eventTitle = readString(formData, "event_title");
  const ticketTypeKey = readString(formData, "ticket_type_key");
  const quantityLabel = readString(formData, "quantity");
  const customerName = readString(formData, "customer_name");
  const customerEmail = readString(formData, "customer_email");
  const newsletterOptIn = wantsNewsletter(formData);

  const quantity = Number.parseInt(quantityLabel, 10);

  if (
    !eventSlug ||
    !eventTitle ||
    !ticketTypeKey ||
    !Number.isFinite(quantity) ||
    quantity < 1 ||
    !customerName ||
    !customerEmail
  ) {
    return {
      success: false,
      message: "Vul tickettype, aantal, naam en e-mail in."
    };
  }

  const event = await getEventBySlug(eventSlug);

  if (!event || !event.ticketTypes?.length) {
    return {
      success: false,
      message: "Dit event heeft momenteel geen tickettypes beschikbaar."
    };
  }

  const ticketType = event.ticketTypes.find((ticket) => ticket.key === ticketTypeKey);

  if (!ticketType?.priceCents) {
    return {
      success: false,
      message: "Dit tickettype is nog niet correct geconfigureerd."
    };
  }

  const supabase = getSupabaseForAction();

  if (!supabase) {
    return { success: false, message: "Serverconfiguratie ontbreekt voor eventtickets." };
  }

  const totalAmountCents = ticketType.priceCents * quantity;

  const { data: insertedOrder, error: insertError } = await supabase
    .from("event_ticket_orders")
    .insert({
      event_slug: eventSlug,
      event_title: eventTitle,
      ticket_type_key: ticketType.key,
      ticket_type_title: ticketType.title,
      quantity,
      customer_name: customerName,
      customer_email: customerEmail,
      unit_price_cents: ticketType.priceCents,
      total_amount_cents: totalAmountCents,
      currency: "EUR",
      status: "created"
    })
    .select("id")
    .single();

  if (insertError || !insertedOrder) {
    return {
      success: false,
      message: `Ticketbestelling kon niet opgeslagen worden${
        insertError?.message ? `: ${insertError.message}` : "."
      }`
    };
  }

  try {
    const amountValue = (totalAmountCents / 100).toFixed(2);
    const payment = await createMolliePayment({
      amount: {
        currency: "EUR",
        value: amountValue
      },
      description: `${eventTitle} · ${ticketType.title} x${quantity}`,
      redirectUrl: `${env.appUrl}/events/bedankt?order=${insertedOrder.id}`,
      metadata: {
        orderId: insertedOrder.id,
        eventSlug
      }
    });

    const { error: updateError } = await supabase
      .from("event_ticket_orders")
      .update({
        mollie_payment_id: payment.id,
        status: "pending"
      })
      .eq("id", insertedOrder.id);

    if (updateError || !payment._links?.checkout?.href) {
      return {
        success: false,
        message: `Betaling kon niet correct voorbereid worden${
          updateError?.message ? `: ${updateError.message}` : "."
        }`
      };
    }

    if (newsletterOptIn) {
      await addToNewsletterList(customerEmail, "event-ticket-checkout");
    }

    redirect(payment._links.checkout.href);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const detail =
      error instanceof Error && error.message ? ` (${error.message.slice(0, 160)})` : "";
    return {
      success: false,
      message: `De betaling kon niet gestart worden${detail}.`
    };
  }
}

export async function unlockEventAccess(
  _prevState: FormStatus,
  formData: FormData
): Promise<FormStatus> {
  const eventSlug = readString(formData, "event_slug");
  const eventTitle = readString(formData, "event_title");
  const accessPassword = readString(formData, "access_password");

  if (!eventSlug || !accessPassword) {
    return {
      success: false,
      message: "Vul het wachtwoord voor dit event in."
    };
  }

  const event = await getEventBySlug(eventSlug);

  if (!event) {
    return {
      success: false,
      message: "Dit event werd niet gevonden."
    };
  }

  const expectedPassword =
    "accessPassword" in event && typeof event.accessPassword === "string"
      ? event.accessPassword
      : "";

  if (!expectedPassword || accessPassword !== expectedPassword) {
    return {
      success: false,
      message: "Het wachtwoord klopt niet."
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(getEventAccessCookieName(eventSlug), createEventAccessToken(eventSlug, accessPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.appUrl.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 8
  });

  redirect(`/${eventSlug}`);
}
