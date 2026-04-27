import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "branding", title: "Branding", default: true },
    { name: "practical", title: "Praktisch" },
    { name: "contact", title: "Contact" }
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      initialValue: "In den Boule",
      group: "branding"
    }),
    defineField({
      name: "heroTagline",
      title: "Hero slogan",
      type: "string",
      initialValue: "Join the legend",
      description: "Korte slogan bovenaan de homepage.",
      group: "branding"
    }),
    defineField({
      name: "address",
      title: "Adres",
      type: "string",
      initialValue: "Augustijnenstraat 2, 3000 Leuven",
      group: "practical"
    }),
    defineField({
      name: "openingHours",
      title: "Openingsuren",
      type: "text",
      rows: 3,
      description: "Gebruik gerust meerdere regels.",
      group: "practical"
    }),
    defineField({
      name: "contactEmail",
      title: "Contact e-mail",
      type: "string",
      group: "contact"
    }),
    defineField({
      name: "contactPhone",
      title: "Telefoonnummer",
      type: "string",
      group: "contact"
    })
  ],
  preview: {
    select: {
      title: "siteTitle",
      subtitle: "address"
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Site settings",
        subtitle: subtitle || "Globale gegevens voor In den Boule"
      };
    }
  }
});
