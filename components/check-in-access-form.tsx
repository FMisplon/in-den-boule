"use client";

import { useActionState } from "react";
import { idleCheckInState, unlockCheckInAccess } from "@/app/actions/event-tickets";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function CheckInAccessForm() {
  const [state, formAction] = useActionState(unlockCheckInAccess, idleCheckInState);

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Staffcode
        <input name="access_code" type="password" placeholder="Voer de interne staffcode in" />
      </label>
      <SubmitButton>Open check-in</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
