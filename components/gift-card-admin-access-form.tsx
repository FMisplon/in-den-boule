"use client";

import { useActionState } from "react";
import { idleGiftCardRedeemState, unlockGiftCardAdmin } from "@/app/actions/gift-cards";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function GiftCardAdminAccessForm() {
  const [state, formAction] = useActionState(unlockGiftCardAdmin, idleGiftCardRedeemState);

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Admincode
        <input name="access_code" type="password" placeholder="Voer de interne cadeauboncode in" />
      </label>
      <SubmitButton>Open redeem tool</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
