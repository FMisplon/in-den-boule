import { defineField, defineType } from "sanity";

export const menuCategoryType = defineType({
  name: "menuCategory",
  title: "Menucategorie",
  type: "document",
  orderings: [
    {
      title: "Volgorde",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }]
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
      description: "Dit is de filterchip op de menupagina, bijvoorbeeld Bagels of Croques.",
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
      type: "richText",
      description: "Optioneel. Handig voor interne context of latere CMS-weergaves."
    }),
    defineField({
      name: "sortOrder",
      title: "Volgorde",
      type: "number",
      initialValue: 0,
      description: "Lagere nummers verschijnen eerst."
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      sortOrder: "sortOrder"
    },
    prepare({ title, subtitle, sortOrder }) {
      return {
        title,
        subtitle: [`#${sortOrder ?? 0}`, subtitle].filter(Boolean).join(" · ")
      };
    }
  }
});
