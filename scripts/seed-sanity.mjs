import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error("Missing Sanity environment variables.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-04-27",
  useCdn: false
});

const categories = [
  {
    _id: "menu-category-pastas",
    _type: "menuCategory",
    title: "Pasta's",
    slug: { _type: "slug", current: "pastas" },
    description: "Spaghetti en andere klassiekers",
    sortOrder: 1
  },
  {
    _id: "menu-category-croques",
    _type: "menuCategory",
    title: "Croques",
    slug: { _type: "slug", current: "croques" },
    sortOrder: 2
  },
  {
    _id: "menu-category-bagels",
    _type: "menuCategory",
    title: "Bagels",
    slug: { _type: "slug", current: "bagels" },
    sortOrder: 3
  },
  {
    _id: "menu-category-snacks",
    _type: "menuCategory",
    title: "Snacks",
    slug: { _type: "slug", current: "snacks" },
    sortOrder: 4
  },
  {
    _id: "menu-category-desserts",
    _type: "menuCategory",
    title: "Desserts",
    slug: { _type: "slug", current: "desserts" },
    sortOrder: 5
  }
];

const menuItems = [
  ["menu-item-spaghetti-boule", "Spaghetti Boule", "De legendarische huisfavoriet.", "13 euro", "menu-category-pastas", 1],
  ["menu-item-spaghetti-jumbo", "Spaghetti Boule Jumbo", "Voor wie honger meebrengt.", "19 euro", "menu-category-pastas", 2],
  ["menu-item-veggie-spaghetti", "Vegetarische spaghetti", "De veggie variant op de klassieker.", "13 euro", "menu-category-pastas", 3],
  ["menu-item-lasagne", "Lasagne", "Klassieke lasagne uit de oven.", "15 euro", "menu-category-pastas", 4],
  ["menu-item-croque-boule", "Croque Boule", "Met huisgemaakte bolognaisesaus, inclusief slaatje.", "13,5 euro", "menu-category-croques", 5],
  ["menu-item-parmaham-bagel", "Parmaham", "Pesto, mozzarella, tomaat en rucola.", "14 euro", "menu-category-bagels", 6],
  ["menu-item-nachos", "Nacho's", "Met guacamole, cheddar en tomatensalsa.", "7 / 9 euro", "menu-category-snacks", 7],
  ["menu-item-mousse", "Chocoladamousse met caramel", "Zoete afsluiter met zachte carameltoets.", "10 euro", "menu-category-desserts", 8]
].map(([id, title, description, priceLabel, categoryId, sortOrder]) => ({
  _id: id,
  _type: "menuItem",
  title,
  description,
  priceLabel,
  category: { _type: "reference", _ref: categoryId },
  available: true,
  sortOrder
}));

const events = [
  {
    _id: "event-jazz-and-bites",
    _type: "event",
    title: "Jazz & Bites",
    slug: { _type: "slug", current: "jazz-and-bites" },
    startsAt: "2026-05-22T20:00:00+02:00",
    teaser: "Live trio, deelgerechten en een intieme zaalopstelling voor 60 gasten.",
    primaryCtaLabel: "Koop ticket",
    published: true,
    ticketTypes: [
      { _key: "regular", title: "Regular", priceLabel: "27 euro", availableQuantity: 62 }
    ]
  },
  {
    _id: "event-chefs-table-noordzee",
    _type: "event",
    title: "Chef's Table: Noordzee Editie",
    slug: { _type: "slug", current: "chefs-table-noordzee" },
    startsAt: "2026-06-04T19:30:00+02:00",
    teaser: "Een exclusieve avond met 5 gangen, pairing en storytelling aan lange tafel.",
    primaryCtaLabel: "Reserveer je stoel",
    published: true,
    ticketTypes: [
      { _key: "dinner", title: "Chef's Table", priceLabel: "79 euro", availableQuantity: 18 }
    ]
  },
  {
    _id: "event-mothers-day-brunch",
    _type: "event",
    title: "Mother's Day Brunch",
    slug: { _type: "slug", current: "mothers-day-brunch" },
    startsAt: "2026-05-10T11:00:00+02:00",
    teaser: "Familietafels, brunchbuffet en kinderformule met tijdssloten.",
    primaryCtaLabel: "Boek brunchslot",
    published: true,
    ticketTypes: [
      { _key: "brunch", title: "Brunch", priceLabel: "42 euro", availableQuantity: 36 }
    ]
  }
];

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteTitle: "In den Boule",
  heroTagline: "Join the legend",
  address: "Augustijnenstraat 2, 3000 Leuven",
  openingHours: "Zondag: 20u-03u\nMaandag - Donderdag: 11u-03u\nVrijdag & Zaterdag: gesloten\nKeuken altijd doorlopend open",
  contactEmail: "hallo@indenboule.be",
  contactPhone: "+32 494 86 98 46"
};

const documents = [...categories, ...menuItems, ...events, siteSettings];

for (const document of documents) {
  await client.createOrReplace(document);
  console.log(`Seeded ${document._id}`);
}

console.log(`Sanity seed complete for dataset "${dataset}".`);
