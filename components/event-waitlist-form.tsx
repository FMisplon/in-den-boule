"use client";

import { useActionState } from "react";
import { submitEventWaitlist } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { NewsletterOptIn } from "@/components/newsletter-opt-in";
import { SubmitButton } from "@/components/submit-button";
import { idleFormState } from "@/lib/forms";

type EventWaitlistFormProps = {
  eventSlug: string;
  eventTitle: string;
};

export function EventWaitlistForm({ eventSlug, eventTitle }: EventWaitlistFormProps) {
  const [state, formAction] = useActionState(submitEventWaitlist, idleFormState);

  return (
    <form className="contact-form" action={formAction}>
      <input type="hidden" name="event_slug" value={eventSlug} />
      <input type="hidden" name="event_title" value={eventTitle} />

      <label>
        Jouw naam
        <input name="name" type="text" placeholder="Wie mogen we contacteren?" />
      </label>

      <label>
        Jouw e-mail
        <input name="email" type="email" placeholder="naam@email.be" />
      </label>

      <NewsletterOptIn id={`waitlist-newsletter-opt-in-${eventSlug}`} />
      <SubmitButton>Zet me op de wachtlijst</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
