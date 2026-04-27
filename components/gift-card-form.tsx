"use client";

import { useActionState } from "react";
import { createGiftCardPayment } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { NewsletterOptIn } from "@/components/newsletter-opt-in";
import { SubmitButton } from "@/components/submit-button";
import { idleFormState } from "@/lib/forms";

export function GiftCardForm() {
  const [state, formAction] = useActionState(createGiftCardPayment, idleFormState);

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Jouw naam
        <input name="purchaser_name" type="text" placeholder="Wie koopt de bon?" />
      </label>
      <label>
        Jouw e-mail
        <input name="purchaser_email" type="email" placeholder="naam@email.be" />
      </label>
      <label>
        Naam ontvanger
        <input name="recipient_name" type="text" placeholder="Voor wie is de bon?" />
      </label>
      <label>
        Bedrag
        <select name="amount" defaultValue="50">
          <option value="25">€25</option>
          <option value="50">€50</option>
          <option value="75">€75</option>
          <option value="100">€100</option>
        </select>
      </label>
      <label>
        Persoonlijke boodschap
        <textarea
          name="personal_message"
          rows={4}
          placeholder="Kort berichtje voor op de cadeaubon"
        />
      </label>
      <NewsletterOptIn id="gift-card-newsletter-opt-in" />
      <SubmitButton>Verder naar betaling</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
