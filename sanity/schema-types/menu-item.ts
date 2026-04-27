import { defineArrayMember, defineField, defineType } from "sanity";

export const menuItemType = defineType({
  name: "menuItem",
  title: "Menu-item",
  type: "document",
  groups: [
    { name: "content", title: "Inhoud", default: true },
    { name: "display", title: "Weergave" },
    { name: "status", title: "Status" }
  ],
  orderings: [
    {
      title: "Categorie + volgorde",
      name: "categoryAndSort",
      by: [
        { field: "category.title", direction: "asc" },
        { field: "sortOrder", direction: "asc" }
      ]
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
      description: "Naam van het gerecht of product op de kaart.",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "reference",
      to: [{ type: "menuCategory" }],
      description: "Bepaalt onder welke filter het item verschijnt.",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      title: "Beschrijving",
      type: "richText",
      group: "content"
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: {
        hotspot: true
      },
      description: "Optioneel. Wordt stijlvol getoond op de menukaart wanneer beschikbaar.",
      group: "display"
    }),
    defineField({
      name: "displayLabel",
      title: "Klein label boven item",
      type: "string",
      description: "Bijvoorbeeld Soep, Oven, Kroketjes of Croques.",
      group: "display"
    }),
    defineField({
      name: "priceLabel",
      title: "Prijslabel",
      type: "string",
      description: "Bijvoorbeeld 14 euro of 15 / 18 euro.",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "tags",
      title: "Labels",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Optioneel voor latere filtering of badges.",
      group: "display"
    }),
    defineField({
      name: "featured",
      title: "Uitgelicht",
      type: "boolean",
      initialValue: false,
      group: "status"
    }),
    defineField({
      name: "available",
      title: "Beschikbaar",
      type: "boolean",
      initialValue: true,
      description: "Zet uit om het item tijdelijk van de kaart te halen.",
      group: "status"
    }),
    defineField({
      name: "sortOrder",
      title: "Volgorde",
      type: "number",
      initialValue: 0,
      description: "Lagere nummers verschijnen eerst binnen de categorie.",
      group: "status"
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceLabel",
      category: "category.title",
      displayLabel: "displayLabel",
      available: "available",
      featured: "featured"
    },
    prepare({ title, subtitle, category, displayLabel, available, featured }) {
      const prefix = [
        available === false ? "Verborgen" : null,
        featured ? "Uitgelicht" : null
      ]
        .filter(Boolean)
        .join(" · ");

      return {
        title,
        subtitle: [
          prefix || null,
          category || null,
          displayLabel || null,
          subtitle || null
        ]
          .filter(Boolean)
          .join(" · ")
      };
    }
  }
});
