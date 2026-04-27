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
