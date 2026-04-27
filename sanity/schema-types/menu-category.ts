import { defineField, defineType } from "sanity";

export const menuCategoryType = defineType({
  name: "menuCategory",
  title: "Menucategorie",
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
      name: "description",
      title: "Beschrijving",
      type: "text",
      rows: 3
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
      subtitle: "description"
    }
  }
});
