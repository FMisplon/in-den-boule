"use client";

type FormFeedbackProps = {
  state: {
    success: boolean;
    message: string;
  };
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
