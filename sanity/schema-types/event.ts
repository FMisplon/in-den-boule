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
              title: "Beschikbaar aantal",
              type: "number",
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
                subtitle: [subtitle, typeof availableQuantity === "number" ? `${availableQuantity} beschikbaar` : null]
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
      published: "published"
    },
    prepare({ title, subtitle, media, venue, published }) {
      return {
        title,
        subtitle: [
          published === false ? "Niet publiek" : "Publiek",
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
