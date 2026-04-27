"use client";

import { useActionState } from "react";
import { createEventTicketPayment } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";
import { idleFormState } from "@/lib/forms";

type EventTicketFormProps = {
  eventSlug: string;
  eventTitle: string;
  ticketTypes: Array<{
    key: string;
    title: string;
    description?: string;
    priceLabel: string;
    priceCents?: number;
    availableQuantity?: number;
  }>;
};

export function EventTicketForm({ eventSlug, eventTitle, ticketTypes }: EventTicketFormProps) {
  const [state, formAction] = useActionState(createEventTicketPayment, idleFormState);

  return (
    <form className="contact-form" action={formAction}>
      <input type="hidden" name="event_slug" value={eventSlug} />
      <input type="hidden" name="event_title" value={eventTitle} />

      <label>
        Tickettype
        <select name="ticket_type_key" defaultValue={ticketTypes[0]?.key}>
          {ticketTypes.map((ticket) => (
            <option key={ticket.key} value={ticket.key}>
              {ticket.title} · {ticket.priceLabel}
            </option>
          ))}
        </select>
      </label>

      <label>
        Aantal tickets
        <select name="quantity" defaultValue="1">
          <option value="1">1 ticket</option>
          <option value="2">2 tickets</option>
          <option value="3">3 tickets</option>
          <option value="4">4 tickets</option>
          <option value="5">5 tickets</option>
          <option value="6">6 tickets</option>
        </select>
      </label>

      <label>
        Jouw naam
        <input name="customer_name" type="text" placeholder="Wie bestelt de tickets?" />
      </label>

      <label>
        Jouw e-mail
        <input name="customer_email" type="email" placeholder="naam@email.be" />
      </label>

      <SubmitButton>Verder naar betaling</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
