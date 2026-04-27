"use client";

import { useActionState } from "react";
import { submitVenueInquiry } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { NewsletterOptIn } from "@/components/newsletter-opt-in";
import { SubmitButton } from "@/components/submit-button";
import { idleFormState } from "@/lib/forms";

export function VenueInquiryForm() {
  const [state, formAction] = useActionState(submitVenueInquiry, idleFormState);

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
        Type event
        <select name="event_type" defaultValue="Receptie">
          <option>Receptie</option>
          <option>Walking dinner</option>
          <option>Seated dinner</option>
          <option>Teambuilding</option>
          <option>Brunch</option>
          <option>Anders</option>
        </select>
      </label>
      <label>
        Gewenste datum
        <input name="preferred_date" type="date" />
      </label>
      <label>
        Aantal gasten
        <input name="guest_count" type="text" placeholder="Bijvoorbeeld 40 gasten" />
      </label>
      <label>
        Extra info
        <textarea name="message" rows={5} placeholder="Timing, catering, techniek, sfeer, ..." />
      </label>
      <NewsletterOptIn id="venue-newsletter-opt-in" />
      <SubmitButton>Vraag offerte aan</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
