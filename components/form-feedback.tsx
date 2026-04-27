"use client";

import type { FormStatus } from "@/lib/forms";

type FormFeedbackProps = {
  state: FormStatus;
};

export function FormFeedback({ state }: FormFeedbackProps) {
  if (!state.message) {
    return null;
  }

  return (
    <p className={`form-feedback ${state.success ? "is-success" : "is-error"}`}>
      {state.message}
    </p>
  );
}
