"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createMolliePayment } from "@/lib/mollie";
import { idleFormState, readString, type FormStatus } from "@/lib/forms";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const supabase = createSupabaseServerClient();
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

  revalidatePath("/reservatie");
  return { success: true, message: "Je reservatieaanvraag is goed ontvangen." };
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

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("contact_requests").insert({
    name,
    email,
    subject,
    message
  });

  if (error) {
    return { success: false, message: "Je bericht kon niet verzonden worden. Probeer opnieuw." };
  }

  revalidatePath("/contact");
  return { success: true, message: "Je bericht is goed ontvangen." };
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

  const supabase = createSupabaseServerClient();
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

  revalidatePath("/verhuur");
  return { success: true, message: "Je offerteaanvraag is goed ontvangen." };
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

  if (!purchaserName || !purchaserEmail || !recipientName || !selectedAmount) {
    return {
      success: false,
      message: "Vul naam, e-mail, ontvanger en bedrag in."
    };
  }

  const supabase = createSupabaseServerClient();
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
      message: "De cadeaubon kon niet gestart worden. Probeer opnieuw."
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
        message: "De betaling kon niet correct voorbereid worden."
      };
    }

    redirect(payment._links.checkout.href);
  } catch {
    return {
      success: false,
      message: "De betaling kon niet gestart worden. Probeer opnieuw."
    };
  }
}

export { idleFormState };
