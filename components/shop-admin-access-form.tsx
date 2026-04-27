"use client";

import { useActionState } from "react";
import { idleShopAdminState, unlockShopAdmin } from "@/app/actions/shop-admin";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function ShopAdminAccessForm() {
  const [state, formAction] = useActionState(unlockShopAdmin, idleShopAdminState);

  return (
    <form className="contact-form" action={formAction}>
      <label>
        Admincode
        <input name="access_code" type="password" placeholder="Voer de interne admincode in" />
      </label>
      <SubmitButton>Open shop-admin</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
