import nodemailer from "nodemailer";

type ReservationMail = {
  kind: "reservation";
  name: string;
  email: string;
  reservationDate: string;
  reservationTime: string;
  partySize: string;
  note?: string | null;
};

type ContactMail = {
  kind: "contact";
  name: string;
  email: string;
  subject: string;
  message: string;
};

type VenueMail = {
  kind: "venue";
  name: string;
  email: string;
  eventType: string;
  preferredDate: string;
  guestCount: string;
  message?: string | null;
};

type NewsletterMail = {
  kind: "newsletter";
  email: string;
  source?: string | null;
};

type EventWaitlistMail = {
  kind: "event-waitlist";
  name: string;
  email: string;
  eventTitle: string;
};

type FormMail = ReservationMail | ContactMail | VenueMail | NewsletterMail | EventWaitlistMail;

type MailResult = {
  enabled: boolean;
  delivered: boolean;
  warning?: string;
};

function readOptionalEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function splitRecipients(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function getMailConfig() {
  const host = readOptionalEnv("SMTP_HOST");
  const port = Number(readOptionalEnv("SMTP_PORT") || "465");
  const user = readOptionalEnv("SMTP_USER");
  const password = readOptionalEnv("SMTP_PASSWORD");

  if (!host || !port || !user || !password) {
    return null;
  }

  const configuredRecipients = splitRecipients(readOptionalEnv("FORM_NOTIFICATION_TO"));

  return {
    host,
    port,
    secure: readOptionalEnv("SMTP_SECURE") !== "false",
    auth: {
      user,
      pass: password
    },
    from: readOptionalEnv("MAIL_FROM") || `In den Boule <${user}>`,
    replyTo: readOptionalEnv("FORM_REPLY_TO") || "hallo@indenboule.be",
    recipients:
      configuredRecipients.length > 0
        ? configuredRecipients
        : ["hallo@indenboule.be", "frederik.misplon@gmail.com"]
  };
}

function getTransporter() {
  const config = getMailConfig();

  if (!config) {
    return null;
  }

  return {
    config,
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth
    })
  };
}

function buildNotificationMail(formMail: FormMail) {
  if (formMail.kind === "event-waitlist") {
    return {
      subject: `[In den Boule] Nieuwe wachtlijstinschrijving voor ${formMail.eventTitle}`,
      text: [
        "Nieuwe wachtlijstinschrijving",
        "",
        `Event: ${formMail.eventTitle}`,
        `Naam: ${formMail.name}`,
        `E-mail: ${formMail.email}`,
        ""
      ].join("\n"),
      html: `
        <h2>Nieuwe wachtlijstinschrijving</h2>
        <p><strong>Event:</strong> ${escapeHtml(formMail.eventTitle)}</p>
        <p><strong>Naam:</strong> ${escapeHtml(formMail.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(formMail.email)}</p>
      `
    };
  }

  if (formMail.kind === "newsletter") {
    return {
      subject: `[In den Boule] Nieuwe nieuwsbriefinschrijving`,
      text: [
        "Nieuwe nieuwsbriefinschrijving",
        "",
        `E-mail: ${formMail.email}`,
        `Bron: ${formMail.source || "website"}`,
        ""
      ].join("\n"),
      html: `
        <h2>Nieuwe nieuwsbriefinschrijving</h2>
        <p><strong>E-mail:</strong> ${escapeHtml(formMail.email)}</p>
        <p><strong>Bron:</strong> ${escapeHtml(formMail.source || "website")}</p>
      `
    };
  }

  if (formMail.kind === "reservation") {
    return {
      subject: `[In den Boule] Nieuwe reservatieaanvraag van ${formMail.name}`,
      text: [
        "Nieuwe reservatieaanvraag",
        "",
        `Naam: ${formMail.name}`,
        `E-mail: ${formMail.email}`,
        `Datum: ${formMail.reservationDate}`,
        `Uur: ${formMail.reservationTime}`,
        `Aantal personen: ${formMail.partySize}`,
        `Opmerking: ${formMail.note || "-"}`,
        ""
      ].join("\n"),
      html: `
        <h2>Nieuwe reservatieaanvraag</h2>
        <p><strong>Naam:</strong> ${escapeHtml(formMail.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(formMail.email)}</p>
        <p><strong>Datum:</strong> ${escapeHtml(formMail.reservationDate)}</p>
        <p><strong>Uur:</strong> ${escapeHtml(formMail.reservationTime)}</p>
        <p><strong>Aantal personen:</strong> ${escapeHtml(formMail.partySize)}</p>
        <p><strong>Opmerking:</strong><br />${formMail.note ? nl2br(formMail.note) : "-"}</p>
      `
    };
  }

  if (formMail.kind === "venue") {
    return {
      subject: `[In den Boule] Nieuwe verhuuraanvraag van ${formMail.name}`,
      text: [
        "Nieuwe verhuuraanvraag",
        "",
        `Naam: ${formMail.name}`,
        `E-mail: ${formMail.email}`,
        `Type event: ${formMail.eventType}`,
        `Gewenste datum: ${formMail.preferredDate}`,
        `Aantal gasten: ${formMail.guestCount}`,
        `Bericht: ${formMail.message || "-"}`,
        ""
      ].join("\n"),
      html: `
        <h2>Nieuwe verhuuraanvraag</h2>
        <p><strong>Naam:</strong> ${escapeHtml(formMail.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(formMail.email)}</p>
        <p><strong>Type event:</strong> ${escapeHtml(formMail.eventType)}</p>
        <p><strong>Gewenste datum:</strong> ${escapeHtml(formMail.preferredDate)}</p>
        <p><strong>Aantal gasten:</strong> ${escapeHtml(formMail.guestCount)}</p>
        <p><strong>Bericht:</strong><br />${formMail.message ? nl2br(formMail.message) : "-"}</p>
      `
    };
  }

  return {
    subject: `[In den Boule] Nieuw contactbericht: ${formMail.subject}`,
    text: [
      "Nieuw contactbericht",
      "",
      `Naam: ${formMail.name}`,
      `E-mail: ${formMail.email}`,
      `Onderwerp: ${formMail.subject}`,
      "",
      formMail.message,
      ""
    ].join("\n"),
    html: `
      <h2>Nieuw contactbericht</h2>
      <p><strong>Naam:</strong> ${escapeHtml(formMail.name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(formMail.email)}</p>
      <p><strong>Onderwerp:</strong> ${escapeHtml(formMail.subject)}</p>
      <p><strong>Bericht:</strong><br />${nl2br(formMail.message)}</p>
    `
  };
}

function buildAutoreplyMail(formMail: FormMail) {
  if (formMail.kind === "event-waitlist") {
    return {
      subject: `Je staat op de wachtlijst voor ${formMail.eventTitle}`,
      text: [
        `Dag ${formMail.name},`,
        "",
        `Bedankt voor je interesse in ${formMail.eventTitle}.`,
        "We hebben je op de wachtlijst gezet en laten iets weten zodra er plaatsen vrijkomen of extra tickets beschikbaar komen.",
        "",
        "Met vriendelijke groeten,",
        "In den Boule",
        "hallo@indenboule.be"
      ].join("\n"),
      html: `
        <p>Dag ${escapeHtml(formMail.name)},</p>
        <p>Bedankt voor je interesse in <strong>${escapeHtml(formMail.eventTitle)}</strong>.</p>
        <p>We hebben je op de wachtlijst gezet en laten iets weten zodra er plaatsen vrijkomen of extra tickets beschikbaar komen.</p>
        <p>Met vriendelijke groeten,<br />In den Boule<br />hallo@indenboule.be</p>
      `
    };
  }

  if (formMail.kind === "newsletter") {
    return {
      subject: "Je staat op de nieuwsbrief van In den Boule",
      text: [
        "Dag,",
        "",
        "Bedankt voor je inschrijving op de nieuwsbrief van In den Boule.",
        "We houden je graag op de hoogte van events, specials en nieuws uit het café.",
        "",
        "Met vriendelijke groeten,",
        "In den Boule",
        "hallo@indenboule.be"
      ].join("\n"),
      html: `
        <p>Dag,</p>
        <p>Bedankt voor je inschrijving op de nieuwsbrief van <strong>In den Boule</strong>.</p>
        <p>We houden je graag op de hoogte van events, specials en nieuws uit het café.</p>
        <p>Met vriendelijke groeten,<br />In den Boule<br />hallo@indenboule.be</p>
      `
    };
  }

  if (formMail.kind === "reservation") {
    return {
      subject: "We hebben je reservatieaanvraag goed ontvangen",
      text: [
        `Dag ${formMail.name},`,
        "",
        "Bedankt voor je reservatieaanvraag bij In den Boule.",
        `We ontvingen je aanvraag voor ${formMail.partySize} personen op ${formMail.reservationDate} om ${formMail.reservationTime}.`,
        "",
        "We bekijken dit zo snel mogelijk en bevestigen je reservatie nog persoonlijk.",
        "",
        "Met vriendelijke groeten,",
        "In den Boule",
        "hallo@indenboule.be"
      ].join("\n"),
      html: `
        <p>Dag ${escapeHtml(formMail.name)},</p>
        <p>Bedankt voor je reservatieaanvraag bij <strong>In den Boule</strong>.</p>
        <p>We ontvingen je aanvraag voor <strong>${escapeHtml(formMail.partySize)}</strong> personen op <strong>${escapeHtml(formMail.reservationDate)}</strong> om <strong>${escapeHtml(formMail.reservationTime)}</strong>.</p>
        <p>We bekijken dit zo snel mogelijk en bevestigen je reservatie nog persoonlijk.</p>
        <p>Met vriendelijke groeten,<br />In den Boule<br />hallo@indenboule.be</p>
      `
    };
  }

  if (formMail.kind === "venue") {
    return {
      subject: "We hebben je verhuuraanvraag goed ontvangen",
      text: [
        `Dag ${formMail.name},`,
        "",
        "Bedankt voor je aanvraag om In den Boule af te huren.",
        `We ontvingen je vraag voor ${formMail.eventType} op ${formMail.preferredDate} voor ${formMail.guestCount} gasten.`,
        "",
        "We nemen snel contact met je op om de mogelijkheden te bespreken.",
        "",
        "Met vriendelijke groeten,",
        "In den Boule",
        "hallo@indenboule.be"
      ].join("\n"),
      html: `
        <p>Dag ${escapeHtml(formMail.name)},</p>
        <p>Bedankt voor je aanvraag om <strong>In den Boule</strong> af te huren.</p>
        <p>We ontvingen je vraag voor <strong>${escapeHtml(formMail.eventType)}</strong> op <strong>${escapeHtml(formMail.preferredDate)}</strong> voor <strong>${escapeHtml(formMail.guestCount)}</strong> gasten.</p>
        <p>We nemen snel contact met je op om de mogelijkheden te bespreken.</p>
        <p>Met vriendelijke groeten,<br />In den Boule<br />hallo@indenboule.be</p>
      `
    };
  }

  return {
    subject: "We hebben je bericht goed ontvangen",
    text: [
      `Dag ${formMail.name},`,
      "",
      "Bedankt voor je bericht aan In den Boule.",
      "We hebben je aanvraag goed ontvangen en komen hier zo snel mogelijk op terug.",
      "",
      "Met vriendelijke groeten,",
      "In den Boule",
      "hallo@indenboule.be"
    ].join("\n"),
    html: `
      <p>Dag ${escapeHtml(formMail.name)},</p>
      <p>Bedankt voor je bericht aan <strong>In den Boule</strong>.</p>
      <p>We hebben je aanvraag goed ontvangen en komen hier zo snel mogelijk op terug.</p>
      <p>Met vriendelijke groeten,<br />In den Boule<br />hallo@indenboule.be</p>
    `
  };
}

export async function sendFormEmails(formMail: FormMail): Promise<MailResult> {
  const mailer = getTransporter();

  if (!mailer) {
    return {
      enabled: false,
      delivered: false,
      warning: "Mailnotificaties zijn nog niet actief."
    };
  }

  const internalMail = buildNotificationMail(formMail);
  const autoreplyMail = buildAutoreplyMail(formMail);

  try {
    await Promise.all([
      mailer.transporter.sendMail({
        from: mailer.config.from,
        to: mailer.config.recipients,
        replyTo:
          formMail.kind === "newsletter" ? mailer.config.replyTo : formMail.email,
        subject: internalMail.subject,
        text: internalMail.text,
        html: internalMail.html
      }),
      mailer.transporter.sendMail({
        from: mailer.config.from,
        to: formMail.email,
        replyTo: mailer.config.replyTo,
        subject: autoreplyMail.subject,
        text: autoreplyMail.text,
        html: autoreplyMail.html
      })
    ]);

    return {
      enabled: true,
      delivered: true
    };
  } catch (error) {
    console.error("[Mail] Failed to send form emails", error);
    return {
      enabled: true,
      delivered: false,
      warning: "Je aanvraag werd opgeslagen, maar de e-mailnotificatie liep mis."
    };
  }
}
