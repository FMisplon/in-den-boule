"use client";

type CookiePreferencesButtonProps = {
  className?: string;
};

export function CookiePreferencesButton({ className }: CookiePreferencesButtonProps) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => window.dispatchEvent(new Event("boule:open-cookie-preferences"))}
    >
      Cookie-instellingen
    </button>
  );
}
