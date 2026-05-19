"use client";

import { useActionState } from "react";
import { unlockVenueAdmin } from "@/app/actions/venue-admin";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function VenueAdminAccessForm() {
  const [state, formAction] = useActionState(unlockVenueAdmin, {
    success: false,
    message: ""
  });

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Admincode
        <input name="access_code" type="password" placeholder="Voer de interne admincode in" />
      </label>
      <SubmitButton>Open verhuur-admin</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
