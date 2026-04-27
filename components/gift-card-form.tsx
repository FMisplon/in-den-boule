"use client";

import { useState } from "react";
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
  const [giftFor, setGiftFor] = useState<"self" | "send">("self");
  const [pickupInStore, setPickupInStore] = useState(false);

  return (
    <form className="contact-form gift-card-form" action={formAction}>
      <input type="hidden" name="product_slug" value={product.slug} />
      <p className="form-hint gift-card-form-intro">
        Je betaalt deze cadeaubon nu online, maar de bon zelf is bedoeld om later te gebruiken in
        Café In den Boule.
      </p>
      <label>
        Jouw naam
        <input name="purchaser_name" type="text" placeholder="Wie koopt de bon?" />
      </label>
      <label>
        Jouw e-mail
        <input name="purchaser_email" type="email" placeholder="naam@email.be" />
      </label>
      <fieldset className="inline-choice-group">
        <legend>De cadeaubon is bestemd voor</legend>
        <label className={`inline-choice inline-choice-option ${giftFor === "self" ? "is-active" : ""}`}>
          <input
            checked={giftFor === "self"}
            name="gift_for"
            type="radio"
            value="self"
            onChange={() => setGiftFor("self")}
          />
          <span>
            <strong>Voor mezelf</strong>
            <small>Ik ontvang de cadeaubon zelf.</small>
          </span>
        </label>
        <label className={`inline-choice inline-choice-option ${giftFor === "send" ? "is-active" : ""}`}>
          <input
            checked={giftFor === "send"}
            name="gift_for"
            type="radio"
            value="send"
            onChange={() => setGiftFor("send")}
          />
          <span>
            <strong>Voor iemand anders</strong>
            <small>We sturen de cadeaubon meteen door naar de ontvanger.</small>
          </span>
        </label>
      </fieldset>
      <label>
        Naam ontvanger
        <input
          name="recipient_name"
          type="text"
          placeholder={giftFor === "self" ? "Jouw naam op de bon" : "Voor wie is de bon?"}
        />
      </label>
      {giftFor === "send" ? (
        <label>
          E-mail ontvanger
          <input
            name="recipient_email"
            type="email"
            placeholder="Waar moeten we de cadeaubon naartoe sturen?"
          />
        </label>
      ) : null}
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
      <label className="checkbox-line">
        <input
          checked={pickupInStore}
          name="pickup_in_store"
          type="checkbox"
          value="yes"
          onChange={(event) => setPickupInStore(event.target.checked)}
        />
        Ik wil de cadeaubon afhalen in Café In den Boule
      </label>
      {pickupInStore ? (
        <p className="form-hint">
          We sturen dan een andere bevestiging en het team krijgt een aparte interne melding voor afhaling.
        </p>
      ) : null}
      <NewsletterOptIn id="gift-card-newsletter-opt-in" />
      <SubmitButton>Betaal cadeaubon</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
