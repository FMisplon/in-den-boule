"use client";

import { useActionState } from "react";
import { unlockEventAdmin } from "@/app/actions/event-admin";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function EventAdminAccessForm() {
  const [state, formAction] = useActionState(unlockEventAdmin, {
    success: false,
    message: ""
  });

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Admincode
        <input name="access_code" type="password" placeholder="Voer de interne admincode in" />
      </label>
      <SubmitButton>Open events-admin</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
