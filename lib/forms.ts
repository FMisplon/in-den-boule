export type FormStatus =
  | { success: true; message: string }
  | { success: false; message: string };

export const idleFormState: FormStatus = {
  success: false,
  message: ""
};

export function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
