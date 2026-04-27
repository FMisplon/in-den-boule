import { defineArrayMember, defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "startsAt",
      title: "Startdatum",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "teaser",
      title: "Korte intro",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "venue",
      title: "Locatie / venue",
      type: "string",
      initialValue: "In den Boule, Leuven"
    }),
    defineField({
      name: "body",
      title: "Beschrijving",
      type: "array",
      of: [defineArrayMember({ type: "block" })]
    }),
    defineField({
      name: "heroImage",
      title: "Hero-afbeelding",
      type: "image",
      options: { hotspot: true }
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
      }
    }),
    defineField({
      name: "ticketUrl",
      title: "Externe ticket-URL",
      type: "url",
      hidden: ({ document }) => document?.ticketingMode !== "external"
    }),
    defineField({
      name: "ticketInfo",
      title: "Ticketinfo",
      type: "text",
      rows: 3,
      description: "Korte praktische tekst onder het bestelblok."
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
              subtitle: "priceLabel"
            }
          }
        })
      ]
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primaire CTA",
      type: "string",
      initialValue: "Koop ticket"
    }),
    defineField({
      name: "published",
      title: "Publiek zichtbaar",
      type: "boolean",
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "startsAt",
      media: "heroImage"
    }
  }
});
