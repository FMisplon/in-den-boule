"use client";

import { useActionState } from "react";
import { unlockReservationAdmin } from "@/app/actions/reservations-admin";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function ReservationAdminAccessForm() {
  const [state, formAction] = useActionState(unlockReservationAdmin, {
    success: false,
    message: ""
  });

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Admincode
        <input name="access_code" type="password" placeholder="Voer de interne admincode in" />
      </label>
      <SubmitButton>Open reservatie-admin</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
