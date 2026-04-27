"use client";

import { useActionState } from "react";
import { submitNewsletterSignup } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";
import { useTrackFormSuccess } from "@/components/use-track-form-success";
import { idleFormState } from "@/lib/forms";

export function NewsletterSignupForm() {
  const [state, formAction] = useActionState(submitNewsletterSignup, idleFormState);

  useTrackFormSuccess(state, () => [
    {
      event: "sign_up",
      payload: {
        method: "site_footer_newsletter"
      }
    },
    {
      event: "newsletter_signup",
      payload: {
        signup_location: "site_footer"
      }
    }
  ]);

  return (
    <form className="newsletter-form" action={formAction}>
      <input name="source" type="hidden" value="site-footer" />
      <label className="newsletter-label" htmlFor="newsletter-email">
        Nieuwsbrief
      </label>
      <div className="newsletter-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="naam@email.be"
          autoComplete="email"
        />
        <SubmitButton>Schrijf in</SubmitButton>
      </div>
      <p className="newsletter-copy">
        Nieuws over events en specials.
      </p>
      <FormFeedback state={state} />
    </form>
  );
}
