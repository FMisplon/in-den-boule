"use client";

import { useActionState } from "react";
import { idleGiftCardRedeemState, redeemGiftCard } from "@/app/actions/gift-cards";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

export function GiftCardRedeemForm() {
  const [state, formAction] = useActionState(redeemGiftCard, idleGiftCardRedeemState);

  const statusClassName =
    state.resultStatus === "valid"
      ? "checkin-result checkin-result-valid"
      : state.resultStatus === "used"
        ? "checkin-result checkin-result-used"
        : state.resultStatus === "refunded"
          ? "checkin-result checkin-result-refunded"
          : state.resultStatus === "invalid"
            ? "checkin-result checkin-result-invalid"
            : "checkin-result";

  return (
    <div className="venue-layout venue-form-layout">
      <article className="venue-panel venue-panel-accent">
        <h3>Redeem cadeaubon</h3>
        <p>Plak een voucherlink of geef rechtstreeks de code in.</p>
        <form className="contact-form" action={formAction}>
          <label>
            Voucherlink of code
            <input
              name="voucher_value"
              type="text"
              placeholder="https://.../cadeaubonnen/BOULE-XXXX-XXXX of BOULE-XXXX-XXXX"
            />
          </label>
          <label>
            Ingeruild door
            <input name="redeemed_by" type="text" placeholder="Optioneel: naam van medewerker" />
          </label>
          <label>
            Notitie
            <textarea
              name="redeem_note"
              rows={3}
              placeholder="Optioneel: extra context bij deze redeem"
            />
          </label>
          <SubmitButton>Markeer als ingeruild</SubmitButton>
          <FormFeedback state={state} />
        </form>
      </article>

      <article className="venue-panel">
        <h3>Resultaat</h3>
        {state.message ? (
          <div className={statusClassName}>
            <strong>{state.success ? "Geldige cadeaubon" : "Controle resultaat"}</strong>
            {state.voucherCode ? <p><strong>Code:</strong> {state.voucherCode}</p> : null}
            {state.recipientName ? <p><strong>Ontvanger:</strong> {state.recipientName}</p> : null}
            {state.amountLabel ? <p><strong>Waarde:</strong> {state.amountLabel}</p> : null}
            {state.redeemedAt ? (
              <p><strong>Redeem tijd:</strong> {new Date(state.redeemedAt).toLocaleString("nl-BE")}</p>
            ) : null}
          </div>
        ) : (
          <p>Na controle zie je hier meteen of de cadeaubon geldig, al gebruikt of ongeldig is.</p>
        )}
      </article>
    </div>
  );
}
