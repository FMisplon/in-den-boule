"use client";

import { useActionState } from "react";
import { createGiftCardPayment } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { NewsletterOptIn } from "@/components/newsletter-opt-in";
import { SubmitButton } from "@/components/submit-button";
import { idleFormState } from "@/lib/forms";
import type { ShopProductItem } from "@/lib/site-data";

type GiftCardFormProps = {
  product: ShopProductItem;
};

export function GiftCardForm({ product }: GiftCardFormProps) {
  const [state, formAction] = useActionState(createGiftCardPayment, idleFormState);

  return (
    <form className="contact-form" action={formAction}>
      <input type="hidden" name="product_slug" value={product.slug} />
      <label>
        Jouw naam
        <input name="purchaser_name" type="text" placeholder="Wie koopt de bon?" />
      </label>
      <label>
        Jouw e-mail
        <input name="purchaser_email" type="email" placeholder="naam@email.be" />
      </label>
      <label>
        Naam ontvanger
        <input name="recipient_name" type="text" placeholder="Voor wie is de bon?" />
      </label>
      <label>
        Bedrag
        <select
          name="amount"
          defaultValue={String(product.priceOptions[0]?.amount || "")}
          disabled={!product.priceOptions.length}
        >
          {product.priceOptions.map((option) => (
            <option key={`${product.slug}-${option.amount}`} value={String(option.amount)}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Persoonlijke boodschap
        <textarea
          name="personal_message"
          rows={4}
          placeholder="Kort berichtje voor op de cadeaubon"
        />
      </label>
      <NewsletterOptIn id="gift-card-newsletter-opt-in" />
      <SubmitButton>Verder naar betaling</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
