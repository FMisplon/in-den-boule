import { defineArrayMember, defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "content", title: "Inhoud", default: true },
    { name: "tickets", title: "Tickets" },
    { name: "publish", title: "Publicatie" }
  ],
  orderings: [
    {
      title: "Startdatum",
      name: "startsAtAsc",
      by: [{ field: "startsAt", direction: "asc" }]
    },
    {
      title: "Titel",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }]
    }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Dit wordt de eigen event-URL, bijvoorbeeld /reunie-8-mei.",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "startsAt",
      title: "Startdatum",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "teaser",
      title: "Korte intro",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "venue",
      title: "Locatie / venue",
      type: "string",
      initialValue: "In den Boule, Leuven",
      group: "content"
    }),
    defineField({
      name: "body",
      title: "Beschrijving",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content"
    }),
    defineField({
      name: "heroImage",
      title: "Hero-afbeelding",
      type: "image",
      options: { hotspot: true },
      group: "content"
    }),
    defineField({
      name: "ticketingMode",
      title: "Ticketverkoop",
      type: "string",
      initialValue: "native",
      options: {
        list: [
          { title: "Interne checkout", value: "native" },
          { title: "Externe ticketlink", value: "external" },
          { title: "Alleen info / contact", value: "info" }
        ],
        layout: "radio"
      },
      description: "Kies hoe bezoekers tickets moeten kopen voor dit event.",
      group: "tickets"
    }),
    defineField({
      name: "salesMode",
      title: "Verkoopstatus",
      type: "string",
      initialValue: "on_sale",
      options: {
        list: [
          { title: "Tickets live", value: "on_sale" },
          { title: "Presale", value: "presale" },
          { title: "Wachtlijst", value: "waitlist" }
        ],
        layout: "radio"
      },
      description:
        "Uitverkocht hoef je niet handmatig te kiezen: zodra alle resterende aantallen op 0 staan, wordt het event automatisch uitverkocht.",
      group: "tickets"
    }),
    defineField({
      name: "listingVisibility",
      title: "Zichtbaarheid op events-pagina",
      type: "string",
      initialValue: "public",
      options: {
        list: [
          { title: "Publiek", value: "public" },
          { title: "Privé (alleen via rechtstreekse slug)", value: "private" }
        ],
        layout: "radio"
      },
      description: "Privé-events verschijnen niet op /events, maar zijn wel bereikbaar via hun eigen slug.",
      group: "publish"
    }),
    defineField({
      name: "accessMode",
      title: "Toegang",
      type: "string",
      initialValue: "open",
      options: {
        list: [
          { title: "Open", value: "open" },
          { title: "Met wachtwoord", value: "password" }
        ],
        layout: "radio"
      },
      group: "publish"
    }),
    defineField({
      name: "accessPassword",
      title: "Event wachtwoord",
      type: "string",
      hidden: ({ document }) => document?.accessMode !== "password",
      description: "Wordt gevraagd voordat de eventpagina zichtbaar wordt.",
      group: "publish"
    }),
    defineField({
      name: "ticketUrl",
      title: "Externe ticket-URL",
      type: "url",
      hidden: ({ document }) => document?.ticketingMode !== "external",
      group: "tickets"
    }),
    defineField({
      name: "ticketInfo",
      title: "Ticketinfo",
      type: "text",
      rows: 3,
      description: "Korte praktische tekst onder het bestelblok."
      ,
      group: "tickets"
    }),
    defineField({
      name: "ticketTypes",
      title: "Tickettypes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titel",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "priceLabel",
              title: "Prijslabel",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "priceCents",
              title: "Prijs in cent",
              type: "number",
              description: "Bijvoorbeeld 2700 voor €27,00.",
              validation: (rule) => rule.required().min(1)
            }),
            defineField({
              name: "description",
              title: "Beschrijving",
              type: "text",
              rows: 2
            }),
            defineField({
              name: "availableQuantity",
              title: "Resterend aantal",
              type: "number",
              description:
                "Aantal tickets dat nog verkocht kan worden. Zet op 0 om dit tickettype uit te verkopen.",
              validation: (rule) => rule.min(0)
            })
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "priceLabel",
              availableQuantity: "availableQuantity"
            },
            prepare({ title, subtitle, availableQuantity }) {
              return {
                title,
                subtitle: [
                  subtitle,
                  typeof availableQuantity === "number"
                    ? availableQuantity > 0
                      ? `${availableQuantity} beschikbaar`
                      : "Uitverkocht"
                    : null
                ]
                  .filter(Boolean)
                  .join(" · ")
              };
            }
          }
        })
      ],
      hidden: ({ document }) => document?.ticketingMode !== "native",
      group: "tickets"
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primaire CTA",
      type: "string",
      initialValue: "Koop ticket",
      group: "tickets"
    }),
    defineField({
      name: "published",
      title: "Publiek zichtbaar",
      type: "boolean",
      initialValue: true,
      group: "publish"
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "startsAt",
      media: "heroImage",
      venue: "venue",
      published: "published",
      listingVisibility: "listingVisibility",
      accessMode: "accessMode",
      salesMode: "salesMode",
      ticketTypes: "ticketTypes"
    },
    prepare({ title, subtitle, media, venue, published, listingVisibility, accessMode, salesMode, ticketTypes }) {
      const totalAvailability = Array.isArray(ticketTypes)
        ? ticketTypes.reduce(
            (sum: number, ticket: { availableQuantity?: number }) =>
              sum + (ticket?.availableQuantity || 0),
            0
          )
        : 0;
      const salesLabel =
        totalAvailability <= 0 && Array.isArray(ticketTypes) && ticketTypes.length > 0
          ? "Uitverkocht"
          : salesMode === "waitlist"
            ? "Wachtlijst"
            : salesMode === "presale"
              ? "Presale"
              : "Tickets live";

      return {
        title,
        subtitle: [
          published === false ? "Niet publiek" : "Publiek",
          listingVisibility === "private" ? "Privé-link" : "In overzicht",
          accessMode === "password" ? "Wachtwoord" : "Open",
          salesLabel,
          subtitle || null,
          venue || null
        ]
          .filter(Boolean)
          .join(" · "),
        media
      };
    }
  }
});
