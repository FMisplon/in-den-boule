import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "branding", title: "Branding", default: true },
    { name: "practical", title: "Praktisch" },
    { name: "contact", title: "Contact" },
    { name: "legal", title: "Juridisch" },
    { name: "social", title: "Socials" },
    { name: "analytics", title: "Analytics" },
    { name: "pageHero", title: "Pagina hero's" }
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
    }),
    defineField({
      name: "legalEntityName",
      title: "Juridische uitbater / vennootschap",
      type: "string",
      description: "Officiële naam van de uitbater of vennootschap.",
      group: "legal"
    }),
    defineField({
      name: "registeredOffice",
      title: "Maatschappelijke zetel",
      type: "string",
      description: "Officieel adres van de vennootschap of uitbater.",
      group: "legal"
    }),
    defineField({
      name: "companyNumber",
      title: "KBO / ondernemingsnummer",
      type: "string",
      description: "Bijvoorbeeld 0123.456.789.",
      group: "legal"
    }),
    defineField({
      name: "vatNumber",
      title: "Btw-nummer",
      type: "string",
      description: "Bijvoorbeeld BE0123.456.789.",
      group: "legal"
    }),
    defineField({
      name: "socialProfiles",
      title: "Sociale profielen",
      type: "array",
      group: "social",
      description: "Voeg alleen de profielen toe die je effectief wilt tonen in de footer.",
      of: [
        defineField({
          name: "profile",
          title: "Profiel",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              validation: (Rule) => Rule.required(),
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "YouTube", value: "youtube" }
                ]
              }
            }),
            defineField({
              name: "url",
              title: "Profiel-URL",
              type: "url",
              validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] })
            }),
            defineField({
              name: "label",
              title: "Aangepast label",
              type: "string",
              description: "Optioneel. Laat leeg om automatisch de platformnaam te gebruiken."
            })
          ],
          preview: {
            select: {
              title: "label",
              platform: "platform",
              subtitle: "url"
            },
            prepare({ title, platform, subtitle }) {
              return {
                title: title || platform || "Sociaal profiel",
                subtitle
              };
            }
          }
        })
      ]
    }),
    defineField({
      name: "gtmContainerId",
      title: "Google Tag Manager container ID",
      type: "string",
      group: "analytics",
      description:
        "Voorbeeld: GTM-ABC1234. De cookiebanner en tracking worden alleen actief als hier een geldige container-ID is ingevuld.",
      validation: (Rule) =>
        Rule.regex(/^GTM-[A-Z0-9]+$/, {
          name: "GTM container ID"
        }).warning("Gebruik het formaat GTM-XXXXXXX.")
    }),
    defineField({
      name: "pageHeroImages",
      title: "Hero-afbeeldingen per pagina",
      type: "array",
      group: "pageHero",
      description:
        "Optioneel. Aanbevolen formaat: 2400 x 1200 px of groter (landscape, ongeveer 2:1). Hou het hoofdonderwerp centraal zodat de uitsnede ook op mobiel mooi blijft.",
      of: [
        defineField({
          name: "pageHero",
          title: "Pagina hero",
          type: "object",
          fields: [
            defineField({
              name: "pageKey",
              title: "Pagina",
              type: "string",
              validation: (Rule) => Rule.required(),
              options: {
                list: [
                  { title: "Menu", value: "menu" },
                  { title: "Events overzicht", value: "events" },
                  { title: "Reservatie", value: "reservatie" },
                  { title: "Shop", value: "shop" },
                  { title: "Verhuur", value: "verhuur" },
                  { title: "Contact", value: "contact" },
                  { title: "Privacy", value: "privacy" },
                  { title: "Cookiebeleid", value: "cookiebeleid" },
                  { title: "Algemene voorwaarden", value: "algemene-voorwaarden" },
                  { title: "Shop bedankt", value: "shop-bedankt" },
                  { title: "Events bedankt", value: "events-bedankt" }
                ]
              }
            }),
            defineField({
              name: "image",
              title: "Afbeelding",
              type: "image",
              options: {
                hotspot: true
              },
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: "alt",
              title: "Alt-tekst",
              type: "string",
              description: "Korte beschrijving van wat op de foto te zien is."
            })
          ],
          preview: {
            select: {
              title: "pageKey",
              subtitle: "alt",
              media: "image"
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Pagina hero",
                subtitle,
                media
              };
            }
          }
        })
      ]
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
