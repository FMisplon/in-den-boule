"use client";

import { useActionState } from "react";
import { idleFormState, submitContact } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, idleFormState);

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Naam
        <input name="name" type="text" placeholder="Jouw naam" />
      </label>
      <label>
        E-mail
        <input name="email" type="email" placeholder="naam@email.be" />
      </label>
      <label>
        Onderwerp
        <select name="subject" defaultValue="Algemene vraag">
          <option>Algemene vraag</option>
          <option>Event of tickets</option>
          <option>Reservatie voor groep</option>
          <option>Cadeaubon</option>
          <option>Verhuur van het café</option>
        </select>
      </label>
      <label>
        Bericht
        <textarea name="message" rows={5} placeholder="Waarmee kunnen we helpen?" />
      </label>
      <SubmitButton>Verzend aanvraag</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
