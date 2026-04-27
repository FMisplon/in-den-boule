import { defineArrayMember, defineField, defineType } from "sanity";

export const shopProductType = defineType({
  name: "shopProduct",
  title: "Shopproduct",
  type: "document",
  groups: [
    { name: "content", title: "Inhoud", default: true },
    { name: "pricing", title: "Prijsopties" },
    { name: "status", title: "Status" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      group: "content",
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
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Korte intro",
      type: "text",
      rows: 3,
      group: "content"
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
              description: "Bijvoorbeeld 5000 voor €50,00.",
              validation: (rule) => rule.required().min(1)
            })
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "amount"
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle:
                  typeof subtitle === "number"
                    ? `${new Intl.NumberFormat("nl-BE", {
                        style: "currency",
                        currency: "EUR"
                      }).format(subtitle / 100)}`
                    : subtitle
              };
            }
          }
        })
      ],
      group: "pricing"
    }),
    defineField({
      name: "active",
      title: "Actief",
      type: "boolean",
      initialValue: true,
      group: "status"
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "productType",
      active: "active"
    },
    prepare({ title, subtitle, active }) {
      const typeLabel =
        subtitle === "gift-card-digital"
          ? "Digitale cadeaubon"
          : subtitle === "physical"
            ? "Fysiek product"
            : subtitle;

      return {
        title,
        subtitle: [active === false ? "Niet actief" : "Actief", typeLabel]
          .filter(Boolean)
          .join(" · ")
      };
    }
  }
});
