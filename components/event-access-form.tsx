"use client";

import { useActionState } from "react";
import { unlockEventAccess } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";
import { idleFormState } from "@/lib/forms";

type EventAccessFormProps = {
  eventSlug: string;
  eventTitle: string;
};

export function EventAccessForm({ eventSlug, eventTitle }: EventAccessFormProps) {
  const [state, formAction] = useActionState(unlockEventAccess, idleFormState);

  return (
    <form className="contact-form" action={formAction}>
      <input type="hidden" name="event_slug" value={eventSlug} />
      <input type="hidden" name="event_title" value={eventTitle} />

      <label>
        Toegangscode
        <input name="access_password" type="password" placeholder="Wachtwoord voor dit event" />
      </label>

      <SubmitButton>Open event</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
