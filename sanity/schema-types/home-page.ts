import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Verhaal" },
    { name: "concept", title: "Sfeer" },
    { name: "highlights", title: "Highlights" },
    { name: "promotions", title: "Actie / promo van de week" }
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
      group: "hero"
    }),
    defineField({
      name: "heroText",
      title: "Hero intro",
      type: "richText",
      group: "hero"
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primaire CTA label",
      type: "string",
      initialValue: "Reserveer je tafel",
      group: "hero"
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Primaire CTA link",
      type: "string",
      initialValue: "/reservatie",
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
      group: "story"
    }),
    defineField({
      name: "storyText",
      title: "Verhaal tekst",
      type: "richText",
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
              type: "string"
            }),
            defineField({
              name: "body",
              title: "Tekst",
              type: "richText"
            })
          ],
          preview: {
            select: { title: "title", subtitle: "body" }
          }
        })
      ],
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
              type: "string"
            }),
            defineField({
              name: "body",
              title: "Tekst",
              type: "richText"
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
      group: "highlights"
    }),
    defineField({
      name: "promotionsEyebrow",
      title: "Promo eyebrow",
      type: "string",
      initialValue: "Actie van de week",
      group: "promotions"
    }),
    defineField({
      name: "promotionsTitle",
      title: "Promo titel",
      type: "string",
      initialValue: "Acties die alleen zichtbaar zijn zolang ze lopen.",
      group: "promotions"
    }),
    defineField({
      name: "promotions",
      title: "Weekpromo's",
      type: "array",
      description:
        "Plan hier maximaal 3 homepage promo's. Alleen promo's waarvan vandaag tussen start- en einddatum valt, verschijnen op de homepage.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titel",
              type: "string"
            }),
            defineField({
              name: "body",
              title: "Tekst",
              type: "richText"
            }),
            defineField({
              name: "image",
              title: "Afbeelding",
              type: "image",
              options: {
                hotspot: true
              },
              description: "Aanbevolen: 1600 x 1100 px of groter, horizontaal beeld."
            }),
            defineField({
              name: "imageAlt",
              title: "Alt-tekst",
              type: "string",
              description: "Korte beschrijving van de promo-afbeelding."
            }),
            defineField({
              name: "startsOn",
              title: "Startdatum",
              type: "date",
              options: {
                dateFormat: "YYYY-MM-DD"
              }
            }),
            defineField({
              name: "endsOn",
              title: "Einddatum",
              type: "date",
              options: {
                dateFormat: "YYYY-MM-DD"
              }
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
              startsOn: "startsOn",
              endsOn: "endsOn",
              media: "image"
            },
            prepare({ title, startsOn, endsOn, media }) {
              return {
                title,
                subtitle:
                  startsOn && endsOn ? `${startsOn} tot ${endsOn}` : "Promo zonder volledige planning",
                media
              };
            }
          }
        })
      ],
      validation: (rule) => rule.max(3),
      group: "promotions"
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
