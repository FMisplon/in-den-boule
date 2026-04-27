import { defineArrayMember, defineField, defineType } from "sanity";

export const shopProductType = defineType({
  name: "shopProduct",
  title: "Shopproduct",
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
      name: "productType",
      title: "Producttype",
      type: "string",
      options: {
        list: [
          { title: "Digitale cadeaubon", value: "gift-card-digital" },
          { title: "Fysiek product", value: "physical" }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Korte intro",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "priceOptions",
      title: "Prijsopties",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "amount",
              title: "Bedrag in cent",
              type: "number",
              validation: (rule) => rule.required().min(1)
            })
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "amount"
            }
          }
        })
      ]
    }),
    defineField({
      name: "active",
      title: "Actief",
      type: "boolean",
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "productType"
    }
  }
});
