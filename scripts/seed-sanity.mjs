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
  ["menu-item-dagsoep", "Dagsoep met brood", "Een eenvoudige starter voor wie licht wil beginnen.", "6 euro", "Soep", "menu-category-pastas", 1],
  ["menu-item-spaghetti-boule", "Spaghetti Boule", "De legendarische huisfavoriet.", "13 euro", "Pasta's", "menu-category-pastas", 2],
  ["menu-item-spaghetti-jumbo", "Spaghetti Boule Jumbo", "Voor wie honger meebrengt.", "19 euro", "Pasta's", "menu-category-pastas", 3],
  ["menu-item-veggie-spaghetti", "Vegetarische spaghetti", "De veggie variant op de klassieker.", "13 euro", "Pasta's", "menu-category-pastas", 4],
  ["menu-item-spaghetti-kaassaus-ham", "Spaghetti kaassaus ham", "Comfort food met romige kaassaus.", "15 euro", "Pasta's", "menu-category-pastas", 5],
  ["menu-item-spaghetti-kip-mascarpone", "Spaghetti kip tomaat mascarpone", "Een zachte saus met kip en mascarpone.", "15 euro", "Pasta's", "menu-category-pastas", 6],
  ["menu-item-lasagne", "Lasagne", "Klassieke lasagne uit de oven.", "15 euro", "Oven", "menu-category-pastas", 7],
  ["menu-item-lasagne-veggie", "Vegetarische lasagne", "De veggie versie van de huislasagne.", "15 euro", "Oven", "menu-category-pastas", 8],
  ["menu-item-uitsmijter", "Uitsmijter", "Boerenbrood, 2 spiegeleieren, hesp, kaas en guacamole.", "15 euro", "Croques", "menu-category-croques", 9],
  ["menu-item-croque-vuistje", "Croque uit 't vuistje", "Kleine snelle croque voor tussendoor.", "6,5 euro", "Croques", "menu-category-croques", 10],
  ["menu-item-croque-monsieur", "Croque Monsieur", "Ham en kaas, inclusief slaatje.", "10,5 euro", "Croques", "menu-category-croques", 11],
  ["menu-item-croque-madame", "Croque Madame", "Enkel kaas, inclusief slaatje.", "10,5 euro", "Croques", "menu-category-croques", 12],
  ["menu-item-croque-cheval", "Croque Cheval", "Met spiegelei, inclusief slaatje.", "12,5 euro", "Croques", "menu-category-croques", 13],
  ["menu-item-croque-boule", "Croque Boule", "Met huisgemaakte bolognaisesaus, inclusief slaatje.", "13,5 euro", "Croques", "menu-category-croques", 14],
  ["menu-item-bagel-gehaktbal", "Gehaktbal", "Met joppiesaus en bickyajuin, inclusief slaatje.", "12 euro", "Bagels", "menu-category-bagels", 15],
  ["menu-item-bagel-parmaham", "Parmaham", "Pesto, mozzarella, tomaat en rucola.", "14 euro", "Bagels", "menu-category-bagels", 16],
  ["menu-item-bagel-rosbief", "Rosbief", "Truffelmayonaise, rucola en parmezaan.", "14 euro", "Bagels", "menu-category-bagels", 17],
  ["menu-item-bagel-kip", "Kip", "Guacamole, parmezaan, rucola en zongedroogde tomaat.", "14 euro", "Bagels", "menu-category-bagels", 18],
  ["menu-item-bagel-boule", "Boule", "Spek, spiegelei, cheddar, guacamole en tomaat.", "12 euro", "Bagels", "menu-category-bagels", 19],
  ["menu-item-kaaskroketten", "Kaaskroketten", "2 of 3 stuks, inclusief slaatje en brood.", "15 / 18 euro", "Kroketjes", "menu-category-snacks", 20],
  ["menu-item-garnaalkroketten", "Garnaalkroketten", "2 of 3 stuks, inclusief slaatje en brood.", "18 / 22 euro", "Kroketjes", "menu-category-snacks", 21],
  ["menu-item-stoofvleeskroketten", "Stoofvleeskroketten", "2 of 3 stuks, inclusief slaatje en brood.", "18 / 22 euro", "Kroketjes", "menu-category-snacks", 22],
  ["menu-item-chips", "Chips", "Een kleine snack bij het glas.", "3 euro", "Snacks", "menu-category-snacks", 23],
  ["menu-item-nachos", "Nacho's", "Met guacamole, cheddar en tomatensalsa.", "7 / 9 euro", "Snacks", "menu-category-snacks", 24],
  ["menu-item-portie-kaas", "Portie kaas", "Klassieke borrelplank-basis.", "8 euro", "Snacks", "menu-category-snacks", 25],
  ["menu-item-portie-salami", "Portie salami", "Voor bij de apero.", "9 euro", "Snacks", "menu-category-snacks", 26],
  ["menu-item-portie-gemengd", "Portie gemengd", "Kaas en salami samen.", "10 euro", "Snacks", "menu-category-snacks", 27],
  ["menu-item-kaasballetjes", "Portie kaasballetjes", "8 stuks.", "10 euro", "Snacks", "menu-category-snacks", 28],
  ["menu-item-garnaalballetjes", "Portie garnaalballetjes", "8 stuks.", "12 euro", "Snacks", "menu-category-snacks", 29],
  ["menu-item-boulet-tartaar", "Boulet met tartaar", "Een snelle klassieker voor tussendoor.", "6,5 euro", "Snacks", "menu-category-snacks", 30],
  ["menu-item-mousse", "Chocoladamousse met caramel", "Zoete afsluiter met zachte carameltoets.", "10 euro", "Desserts", "menu-category-desserts", 31],
  ["menu-item-verwenkoffie", "Verwenkoffie", "Koffie met 4 kleine dessertjes.", "9 euro", "Desserts", "menu-category-desserts", 32]
].map(([id, title, description, priceLabel, displayLabel, categoryId, sortOrder]) => ({
  _id: id,
  _type: "menuItem",
  title,
  description,
  displayLabel,
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
    venue: "In den Boule, Leuven",
    primaryCtaLabel: "Koop ticket",
    listingVisibility: "public",
    accessMode: "open",
    salesMode: "on_sale",
    ticketingMode: "native",
    ticketInfo: "Na betaling ontvang je een bevestiging per e-mail. De uiteindelijke e-ticket mailflow koppelen we in de volgende stap.",
    published: true,
    ticketTypes: [
      {
        _key: "regular",
        title: "Regular",
        description: "Toegang tot concertavond en bitesformule.",
        priceLabel: "27 euro",
        priceCents: 2700,
        availableQuantity: 62
      }
    ]
  },
  {
    _id: "event-chefs-table-noordzee",
    _type: "event",
    title: "Chef's Table: Noordzee Editie",
    slug: { _type: "slug", current: "chefs-table-noordzee" },
    startsAt: "2026-06-04T19:30:00+02:00",
    teaser: "Een exclusieve avond met 5 gangen, pairing en storytelling aan lange tafel.",
    venue: "In den Boule, Leuven",
    primaryCtaLabel: "Reserveer je stoel",
    listingVisibility: "public",
    accessMode: "open",
    salesMode: "presale",
    ticketingMode: "native",
    published: true,
    ticketTypes: [
      {
        _key: "dinner",
        title: "Chef's Table",
        description: "5 gangen aan de lange tafel met pairing.",
        priceLabel: "79 euro",
        priceCents: 7900,
        availableQuantity: 18
      }
    ]
  },
  {
    _id: "event-mothers-day-brunch",
    _type: "event",
    title: "Mother's Day Brunch",
    slug: { _type: "slug", current: "mothers-day-brunch" },
    startsAt: "2026-05-10T11:00:00+02:00",
    teaser: "Familietafels, brunchbuffet en kinderformule met tijdssloten.",
    venue: "In den Boule, Leuven",
    primaryCtaLabel: "Boek brunchslot",
    listingVisibility: "public",
    accessMode: "open",
    salesMode: "waitlist",
    ticketingMode: "native",
    published: true,
    ticketTypes: [
      {
        _key: "brunch",
        title: "Brunch",
        description: "Brunchtoegang per persoon.",
        priceLabel: "42 euro",
        priceCents: 4200,
        availableQuantity: 36
      }
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

const homePage = {
  _id: "homePage",
  _type: "homePage",
  heroEyebrow: "In den Boule",
  heroTitle: "Join the legend",
  heroText:
    "Een Leuvense legende met karakter, geschiedenis en lange nachten. Van lunch tot late service, van vaste stamgasten tot nieuwe verhalen aan tafel: In den Boule voelt tegelijk iconisch en levendig.",
  primaryCtaLabel: "Reserveer je tafel",
  primaryCtaHref: "/reservatie",
  secondaryCtaLabel: "Bekijk events",
  secondaryCtaHref: "/events",
  heroPoints: [
    "Keuken altijd doorlopend open",
    "Events met ticketverkoop",
    "Verhuur en cadeaubonnen als aparte flows"
  ],
  storyEyebrow: "Het verhaal",
  storyTitle: "Een plek waar traditie, gezelligheid en nieuwe energie samenkomen.",
  storyText:
    "De homepage hoeft niet alles tegelijk te verkopen. Hier zetten we vooral het gevoel neer, en van hieruit begeleiden we bezoekers gericht naar menu, reservaties, events, shop of verhuur.",
  conceptEyebrow: "De sfeer",
  conceptTitle:
    "Een huis vol verhalen, karakterkoppen, volle glazen en avonden die blijven hangen.",
  conceptCards: [
    {
      _key: "legendary",
      title: "Legendarisch",
      body: "In den Boule heeft een eigen plaats in Leuven. Die herkenbaarheid moet ook online voelbaar zijn."
    },
    {
      _key: "lively",
      title: "Levendig",
      body: "Lunch, diner, events en late service vragen om een site die energie geeft zonder chaotisch te worden."
    },
    {
      _key: "focused",
      title: "Gericht",
      body: "Elke hoofdvraag krijgt zijn eigen pagina, zodat bezoekers sneller vinden wat ze nodig hebben en sneller doorklikken."
    }
  ],
  highlightsEyebrow: "Highlights",
  highlightsTitle:
    "De homepage blijft landing page, terwijl de aparte pagina's de echte acties opvangen.",
  highlightCards: [
    {
      _key: "menu",
      eyebrow: "Menu",
      title: "Eten & drinken",
      body: "Spaghetti en kaart in een eigen flow, zonder afleiding.",
      ctaLabel: "Naar menu",
      ctaHref: "/menu"
    },
    {
      _key: "events",
      eyebrow: "Events",
      title: "Programma & tickets",
      body: "{eventCount} events klaar als aparte detailpagina's voor promotie en tickets.",
      ctaLabel: "Bekijk events",
      ctaHref: "/events"
    },
    {
      _key: "shop",
      eyebrow: "Shop",
      title: "Cadeaubonnen",
      body: "De MVP focust bewust op gift cards als eerste echte checkoutflow.",
      ctaLabel: "Naar shop",
      ctaHref: "/shop"
    }
  ]
};

const documents = [...categories, ...menuItems, ...events, siteSettings, homePage];

const seededMenuCategoryIds = categories.map((document) => document._id);
const seededMenuItemIds = menuItems.map((document) => document._id);

const staleMenuCategoryIds = await client.fetch(
  `*[_type == "menuCategory" && !(_id in $ids)]._id`,
  { ids: seededMenuCategoryIds }
);

const staleMenuItemIds = await client.fetch(`*[_type == "menuItem" && !(_id in $ids)]._id`, {
  ids: seededMenuItemIds
});

for (const staleId of [...staleMenuItemIds, ...staleMenuCategoryIds]) {
  await client.delete(staleId);
  console.log(`Deleted stale ${staleId}`);
}

for (const document of documents) {
  await client.createOrReplace(document);
  console.log(`Seeded ${document._id}`);
}

console.log(`Sanity seed complete for dataset "${dataset}".`);
