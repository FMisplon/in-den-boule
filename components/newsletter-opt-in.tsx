type NewsletterOptInProps = {
  id?: string;
};

export function NewsletterOptIn({ id = "newsletter-opt-in" }: NewsletterOptInProps) {
  return (
    <label className="checkbox-field" htmlFor={id}>
      <input id={id} name="newsletter_opt_in" type="checkbox" value="yes" />
      <span>Ja, ik wil op de hoogte gehouden worden van het laatste nieuws van In den Boule.</span>
    </label>
  );
}
