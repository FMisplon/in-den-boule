import { defineArrayMember, defineField, defineType } from "sanity";

export const menuItemType = defineType({
  name: "menuItem",
  title: "Menu-item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "reference",
      to: [{ type: "menuCategory" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      title: "Beschrijving",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "displayLabel",
      title: "Klein label boven item",
      type: "string",
      description: "Bijvoorbeeld Soep, Oven, Kroketjes of Croques."
    }),
    defineField({
      name: "priceLabel",
      title: "Prijslabel",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "tags",
      title: "Labels",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "featured",
      title: "Uitgelicht",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "available",
      title: "Beschikbaar",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "sortOrder",
      title: "Volgorde",
      type: "number",
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceLabel"
    }
  }
});
