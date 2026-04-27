import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Verhaal" },
    { name: "concept", title: "Sfeer" },
    { name: "highlights", title: "Highlights" }
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "string",
      initialValue: "In den Boule",
      group: "hero"
    }),
    defineField({
      name: "heroTitle",
      title: "Hero titel",
      type: "string",
      initialValue: "Join the legend",
      validation: (rule) => rule.required(),
      group: "hero"
    }),
    defineField({
      name: "heroText",
      title: "Hero intro",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
      group: "hero"
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primaire CTA label",
      type: "string",
      initialValue: "Reserveer je tafel",
      validation: (rule) => rule.required(),
      group: "hero"
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Primaire CTA link",
      type: "string",
      initialValue: "/reservatie",
      validation: (rule) => rule.required(),
      group: "hero"
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secundaire CTA label",
      type: "string",
      initialValue: "Bekijk events",
      group: "hero"
    }),
    defineField({
      name: "secondaryCtaHref",
      title: "Secundaire CTA link",
      type: "string",
      initialValue: "/events",
      group: "hero"
    }),
    defineField({
      name: "heroPoints",
      title: "Hero bullets",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Korte punten onder de hero CTA's.",
      group: "hero"
    }),
    defineField({
      name: "storyEyebrow",
      title: "Verhaal eyebrow",
      type: "string",
      initialValue: "Het verhaal",
      group: "story"
    }),
    defineField({
      name: "storyTitle",
      title: "Verhaal titel",
      type: "string",
      validation: (rule) => rule.required(),
      group: "story"
    }),
    defineField({
      name: "storyText",
      title: "Verhaal tekst",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
      group: "story"
    }),
    defineField({
      name: "conceptEyebrow",
      title: "Sfeer eyebrow",
      type: "string",
      initialValue: "De sfeer",
      group: "concept"
    }),
    defineField({
      name: "conceptTitle",
      title: "Sfeer titel",
      type: "string",
      validation: (rule) => rule.required(),
      group: "concept"
    }),
    defineField({
      name: "conceptCards",
      title: "Sfeer kaarten",
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
              name: "body",
              title: "Tekst",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: { title: "title", subtitle: "body" }
          }
        })
      ],
      validation: (rule) => rule.min(1),
      group: "concept"
    }),
    defineField({
      name: "highlightsEyebrow",
      title: "Highlights eyebrow",
      type: "string",
      initialValue: "Highlights",
      group: "highlights"
    }),
    defineField({
      name: "highlightsTitle",
      title: "Highlights titel",
      type: "string",
      validation: (rule) => rule.required(),
      group: "highlights"
    }),
    defineField({
      name: "highlightCards",
      title: "Highlight kaarten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "eyebrow",
              title: "Klein label",
              type: "string"
            }),
            defineField({
              name: "title",
              title: "Titel",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "body",
              title: "Tekst",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "ctaLabel",
              title: "CTA label",
              type: "string"
            }),
            defineField({
              name: "ctaHref",
              title: "CTA link",
              type: "string"
            })
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow"
            }
          }
        })
      ],
      validation: (rule) => rule.min(1),
      group: "highlights"
    })
  ],
  preview: {
    select: {
      title: "heroTitle",
      subtitle: "storyTitle"
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Homepage",
        subtitle: subtitle || "Homepage inhoud"
      };
    }
  }
});
