import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      initialValue: "In den Boule"
    }),
    defineField({
      name: "heroTagline",
      title: "Hero slogan",
      type: "string",
      initialValue: "Join the legend"
    }),
    defineField({
      name: "address",
      title: "Adres",
      type: "string",
      initialValue: "Augustijnenstraat 2, 3000 Leuven"
    }),
    defineField({
      name: "openingHours",
      title: "Openingsuren",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "contactEmail",
      title: "Contact e-mail",
      type: "string"
    }),
    defineField({
      name: "contactPhone",
      title: "Telefoonnummer",
      type: "string"
    })
  ],
  preview: {
    prepare() {
      return {
        title: "Site settings",
        subtitle: "Globale gegevens voor In den Boule"
      };
    }
  }
});
