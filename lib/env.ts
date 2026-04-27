function readEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  sanityProjectId: readEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "817hu0y2"),
  sanityDataset: readEnv("NEXT_PUBLIC_SANITY_DATASET", "production"),
  sanityApiToken: process.env.SANITY_API_TOKEN,
  supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL", "https://jmhvlqlxxtmhjntpyiwi.supabase.co"),
  supabasePublishableKey: readEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "sb_publishable_1cHXqsb8837G52mT1eS5RA_Hdm5Up26"
  ),
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  mollieApiKey: process.env.MOLLIE_API_KEY,
  appUrl: readEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpSecure: process.env.SMTP_SECURE,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  mailFrom: process.env.MAIL_FROM,
  formNotificationTo: process.env.FORM_NOTIFICATION_TO,
  formReplyTo: process.env.FORM_REPLY_TO,
  checkInAccessCode: process.env.CHECK_IN_ACCESS_CODE,
  giftCardAdminAccessCode: process.env.GIFT_CARD_ADMIN_ACCESS_CODE
};
