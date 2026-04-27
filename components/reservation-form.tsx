"use client";

import { useActionState } from "react";
import { idleFormState, submitReservation } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function ReservationForm() {
  const [state, formAction] = useActionState(submitReservation, idleFormState);

  return (
    <form className="reservation-form" action={formAction}>
      <label>
        Datum
        <input name="reservation_date" type="date" />
      </label>
      <label>
        Uur
        <select name="reservation_time" defaultValue="19:00">
          <option>18:00</option>
          <option>19:00</option>
          <option>20:00</option>
        </select>
      </label>
      <label>
        Aantal gasten
        <select name="party_size" defaultValue="2 personen">
          <option>2 personen</option>
          <option>4 personen</option>
          <option>6 personen</option>
          <option>8+ personen</option>
        </select>
      </label>
      <label>
        Naam
        <input name="name" type="text" placeholder="Jouw naam" />
      </label>
      <label>
        E-mail
        <input name="email" type="email" placeholder="naam@email.be" />
      </label>
      <label>
        Opmerking
        <textarea name="note" rows={4} placeholder="Verjaardag, allergie, grotere groep, ..." />
      </label>
      <SubmitButton>Verstuur aanvraag</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
