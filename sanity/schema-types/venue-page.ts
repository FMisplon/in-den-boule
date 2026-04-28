import { defineField, defineType } from "sanity";

export const venuePageType = defineType({
  name: "venuePage",
  title: "Verhuurpagina",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero titel", type: "string" }),
    defineField({ name: "heroIntro", title: "Hero intro", type: "richText" }),
    defineField({ name: "overviewTitle", title: "Linker blok titel", type: "string" }),
    defineField({ name: "overviewBody", title: "Linker blok tekst", type: "richText" }),
    defineField({
      name: "overviewBullets",
      title: "Linker blok opsomming",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({ name: "formatsTitle", title: "Rechter blok titel", type: "string" }),
    defineField({
      name: "formatsSummary",
      title: "Rechter blok samenvatting",
      type: "text",
      rows: 2
    }),
    defineField({
      name: "capacities",
      title: "Capaciteitstags",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "formatsNote",
      title: "Rechter blok extra tekst",
      type: "richText"
    }),
    defineField({
      name: "inquiryEyebrow",
      title: "Aanvraag eyebrow",
      type: "string"
    }),
    defineField({ name: "inquiryTitle", title: "Aanvraag titel", type: "string" }),
    defineField({ name: "inquiryBody", title: "Aanvraag tekst", type: "richText" })
  ],
  preview: {
    select: {
      title: "heroTitle",
      subtitle: "heroEyebrow"
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Verhuurpagina",
        subtitle: subtitle || "Content voor de verhuurpagina"
      };
    }
  }
});
