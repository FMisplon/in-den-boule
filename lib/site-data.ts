import type { RichTextValue } from "@/lib/sanity/rich-text";

export type NavItem = {
  href: string;
  label: string;
};

export type MenuDietaryLabel = "Veggie" | "Vegan" | "Glutenvrij";

export type MenuItem = {
  category: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  tags?: MenuDietaryLabel[];
};

export type EventItem = {
  slug: string;
  dateLabel: string;
  title: string;
  intro: string;
  priceLabel: string;
  availabilityLabel: string;
  description: string;
  ctaLabel: string;
  venue?: string;
  listingVisibility?: "public" | "private";
  accessMode?: "open" | "password";
  salesMode?: "on_sale" | "presale" | "waitlist";
  salesStatus?: "on_sale" | "presale" | "waitlist" | "sold_out";
  salesBadge?: string;
  canBuyTickets?: boolean;
  heroImageUrl?: string;
  descriptionRich?: RichTextValue;
  body?: RichTextValue;
  ticketingMode?: "native" | "external" | "info";
  ticketUrl?: string;
  ticketInfo?: string;
  ticketInfoRich?: RichTextValue;
  ticketTypes?: Array<{
    key: string;
    title: string;
    description?: string;
    descriptionRich?: RichTextValue;
    priceLabel: string;
    priceCents?: number;
    availableQuantity?: number;
    isSoldOut?: boolean;
  }>;
};

export type HomePageCard = {
  eyebrow?: string;
  title: string;
  body: string;
  bodyRich?: RichTextValue;
  ctaLabel?: string;
  ctaHref?: string;
};

export type HomePagePromotionCard = {
  title: string;
  body: string;
  bodyRich?: RichTextValue;
  imageUrl?: string;
  imageAlt?: string;
  startsOn: string;
  endsOn: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type HomePageConfig = {
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroTextRich?: RichTextValue;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroPoints: string[];
  storyEyebrow: string;
  storyTitle: string;
  storyText: string;
  storyTextRich?: RichTextValue;
  conceptEyebrow: string;
  conceptTitle: string;
  conceptCards: HomePageCard[];
  highlightsEyebrow: string;
  highlightsTitle: string;
  highlightCards: HomePageCard[];
  promotionsEyebrow: string;
  promotionsTitle: string;
  promotions: HomePagePromotionCard[];
};

export type ShopProductItem = {
  id: string;
  title: string;
  slug: string;
  productType: "gift-card-digital" | "physical";
  excerpt: string;
  excerptRich?: RichTextValue;
  active: boolean;
  priceOptions: Array<{
    label: string;
    amount: number;
  }>;
};

export type PageHeroKey =
  | "menu"
  | "events"
  | "reservatie"
  | "shop"
  | "verhuur"
  | "contact"
  | "privacy"
  | "cookiebeleid"
  | "algemene-voorwaarden"
  | "shop-bedankt"
  | "events-bedankt";

export type VenuePageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  heroIntroRich?: RichTextValue;
  overviewTitle: string;
  overviewBody: string;
  overviewBodyRich?: RichTextValue;
  overviewBullets: string[];
  formatsTitle: string;
  formatsSummary: string;
  capacities: string[];
  formatsNote: string;
  formatsNoteRich?: RichTextValue;
  inquiryEyebrow: string;
  inquiryTitle: string;
  inquiryBody: string;
  inquiryBodyRich?: RichTextValue;
};

export const site = {
  name: "In den Boule",
  tagline: "Join the legend",
  headerLine: "cafe · feest · keuken · events",
  address: "Augustijnenstraat 2, 3000 Leuven",
  hours: "Zondag: 20u-03u · Maandag - Donderdag: 11u-03u · Vrijdag & Zaterdag: gesloten",
  kitchen: "Altijd doorlopend open",
  contactEmail: "hallo@indenboule.be",
  contactPhone: "+32 494 86 98 46",
  legalEntityName: "",
  registeredOffice: "",
  companyNumber: "",
  vatNumber: "",
  gtmContainerId: "",
  pageHeroImages: [] as Array<{
    pageKey: PageHeroKey;
    imageUrl: string;
    alt: string;
  }>,
  socialProfiles: [] as Array<{
    platform: "instagram" | "facebook" | "tiktok" | "linkedin" | "youtube";
    url: string;
    label: string;
  }>,
  venuePage: {
    heroEyebrow: "Verhuur",
    heroTitle: "Huur In den Boule af voor private events, diners en feestavonden.",
    heroIntro:
      "Voor recepties, diners, bedrijfsmomenten en feestavonden huur je geen apart zaaltje, maar het karakter van het hele huis. We denken mee over sfeer, opstelling en praktische omkadering.",
    overviewTitle: "Een plek met karakter voor events op maat",
    overviewBody:
      "In den Boule is geschikt voor avonden die warmte, persoonlijkheid en een sterk kader vragen. Van een intiem diner tot een levendige receptie: we stemmen de setting af op het type moment dat je wilt neerzetten.",
    overviewBullets: [
      "Private diners, recepties en feestavonden met eigen sfeer",
      "Flexibele invulling voor bedrijven, teams en particuliere groepen",
      "Praktische afstemming rond timing, catering, techniek en ontvangst"
    ],
    formatsTitle: "Formules die hier goed werken",
    formatsSummary: "Receptie · walking dinner · seated dinner · teambuilding · brunch",
    capacities: ["40 zittend", "70 receptie", "AV mogelijk"],
    formatsNote:
      "Vertel ons hoeveel gasten je verwacht en welk soort avond je voor ogen hebt, dan bekijken we samen wat het best past.",
    inquiryEyebrow: "Offerteaanvraag",
    inquiryTitle: "Vertel ons kort wat je organiseert.",
    inquiryBody:
      "Met datum, type event en een ruwe inschatting van het aantal gasten kunnen we snel inschatten wat mogelijk is en gericht terugkoppelen."
  } as VenuePageContent
};

export const shopProducts: ShopProductItem[] = [
  {
    id: "fallback-gift-card-digital",
    title: "Digitale cadeaubon",
    slug: "digitale-cadeaubon",
    productType: "gift-card-digital",
    excerpt:
      "Digitale voucher voor In den Boule met vaste bedragen, online bestelbaar en later inwisselbaar in het café.",
    active: true,
    priceOptions: [
      { label: "€25", amount: 2500 },
      { label: "€50", amount: 5000 },
      { label: "€75", amount: 7500 },
      { label: "€100", amount: 10000 }
    ]
  }
];

export const homePage: HomePageConfig = {
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
      title: "Legendarisch",
      body: "In den Boule heeft een eigen plaats in Leuven. Die herkenbaarheid moet ook online voelbaar zijn."
    },
    {
      title: "Levendig",
      body: "Lunch, diner, events en late service vragen om een site die energie geeft zonder chaotisch te worden."
    },
    {
      title: "Gericht",
      body: "Elke hoofdvraag krijgt zijn eigen pagina, zodat bezoekers sneller vinden wat ze nodig hebben en sneller doorklikken."
    }
  ],
  highlightsEyebrow: "Highlights",
  highlightsTitle:
    "De homepage blijft landing page, terwijl de aparte pagina's de echte acties opvangen.",
  highlightCards: [
    {
      eyebrow: "Menu",
      title: "Eten & drinken",
      body: "Spaghetti en kaart in een eigen flow, zonder afleiding.",
      ctaLabel: "Naar menu",
      ctaHref: "/menu"
    },
    {
      eyebrow: "Events",
      title: "Programma & tickets",
      body: "{eventCount} events klaar als aparte detailpagina's voor promotie en tickets.",
      ctaLabel: "Bekijk events",
      ctaHref: "/events"
    },
    {
      eyebrow: "Shop",
      title: "Cadeaubonnen",
      body: "Bestel digitale cadeaubonnen online en laat iemand later in het café genieten.",
      ctaLabel: "Naar shop",
      ctaHref: "/shop"
    }
  ],
  promotionsEyebrow: "Actie van de week",
  promotionsTitle: "Deze sectie verschijnt alleen wanneer er actieve promo's in Sanity ingepland staan.",
  promotions: []
};

export const mainNav: NavItem[] = [
  { href: "/reservatie", label: "Reservatie" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/verhuur", label: "Verhuur" },
  { href: "/contact", label: "Contact" }
];

export const menuItems: MenuItem[] = [
  { category: "Pasta's", title: "Dagsoep met brood", description: "Een eenvoudige starter voor wie licht wil beginnen.", price: "6 euro" },
  { category: "Pasta's", title: "Spaghetti Boule", description: "De legendarische huisfavoriet.", price: "13 euro" },
  { category: "Pasta's", title: "Spaghetti Boule Jumbo", description: "Voor wie honger meebrengt.", price: "19 euro" },
  { category: "Pasta's", title: "Vegetarische spaghetti", description: "De veggie variant op de klassieker.", price: "13 euro", tags: ["Veggie"] },
  { category: "Pasta's", title: "Spaghetti kaassaus ham", description: "Comfort food met romige kaassaus.", price: "15 euro" },
  { category: "Pasta's", title: "Spaghetti kip tomaat mascarpone", description: "Een zachte saus met kip en mascarpone.", price: "15 euro" },
  { category: "Pasta's", title: "Lasagne", description: "Klassieke lasagne uit de oven.", price: "15 euro" },
  { category: "Pasta's", title: "Vegetarische lasagne", description: "De veggie versie van de huislasagne.", price: "15 euro", tags: ["Veggie"] },
  { category: "Croques", title: "Uitsmijter", description: "Boerenbrood, 2 spiegeleieren, hesp, kaas en guacamole.", price: "15 euro" },
  { category: "Croques", title: "Croque uit 't vuistje", description: "Kleine snelle croque voor tussendoor.", price: "6,5 euro" },
  { category: "Croques", title: "Croque Monsieur", description: "Ham en kaas, inclusief slaatje.", price: "10,5 euro" },
  { category: "Croques", title: "Croque Madame", description: "Enkel kaas, inclusief slaatje.", price: "10,5 euro" },
  { category: "Croques", title: "Croque Cheval", description: "Met spiegelei, inclusief slaatje.", price: "12,5 euro" },
  { category: "Croques", title: "Croque Boule", description: "Met huisgemaakte bolognaisesaus, inclusief slaatje.", price: "13,5 euro" },
  { category: "Bagels", title: "Gehaktbal", description: "Met joppiesaus en bickyajuin, inclusief slaatje.", price: "12 euro" },
  { category: "Bagels", title: "Parmaham", description: "Pesto, mozzarella, tomaat en rucola.", price: "14 euro" },
  { category: "Bagels", title: "Rosbief", description: "Truffelmayonaise, rucola en parmezaan.", price: "14 euro" },
  { category: "Bagels", title: "Kip", description: "Guacamole, parmezaan, rucola en zongedroogde tomaat.", price: "14 euro" },
  { category: "Bagels", title: "Boule", description: "Spek, spiegelei, cheddar, guacamole en tomaat.", price: "12 euro" },
  { category: "Snacks", title: "Kaaskroketten", description: "2 of 3 stuks, inclusief slaatje en brood.", price: "15 / 18 euro" },
  { category: "Snacks", title: "Garnaalkroketten", description: "2 of 3 stuks, inclusief slaatje en brood.", price: "18 / 22 euro" },
  { category: "Snacks", title: "Stoofvleeskroketten", description: "2 of 3 stuks, inclusief slaatje en brood.", price: "18 / 22 euro" },
  { category: "Snacks", title: "Chips", description: "Een kleine snack bij het glas.", price: "3 euro" },
  { category: "Snacks", title: "Nacho's", description: "Met guacamole, cheddar en tomatensalsa.", price: "7 / 9 euro" },
  { category: "Snacks", title: "Portie kaas", description: "Klassieke borrelplank-basis.", price: "8 euro" },
  { category: "Snacks", title: "Portie salami", description: "Voor bij de apero.", price: "9 euro" },
  { category: "Snacks", title: "Portie gemengd", description: "Kaas en salami samen.", price: "10 euro" },
  { category: "Snacks", title: "Portie kaasballetjes", description: "8 stuks.", price: "10 euro" },
  { category: "Snacks", title: "Portie garnaalballetjes", description: "8 stuks.", price: "12 euro" },
  { category: "Snacks", title: "Boulet met tartaar", description: "Een snelle klassieker voor tussendoor.", price: "6,5 euro" },
  { category: "Desserts", title: "Chocoladamousse met caramel", description: "Zoete afsluiter met zachte carameltoets.", price: "10 euro" },
  { category: "Desserts", title: "Verwenkoffie", description: "Koffie met 4 kleine dessertjes.", price: "9 euro" }
];

export const events: EventItem[] = [
  {
    slug: "jazz-and-bites",
    dateLabel: "Vrijdag 19 april · 20:00",
    title: "Jazz & Bites",
    intro: "Live trio, deelgerechten en een intieme zaalopstelling voor 60 gasten.",
    priceLabel: "27 euro",
    availabilityLabel: "62 tickets beschikbaar",
    description: "Een avond die eten, muziek en cafékarakter samenbrengt. Voor de demo tonen we al hoe een standalone eventpagina kan werken voor promotie en ticketverkoop.",
    ctaLabel: "Koop ticket",
    venue: "In den Boule, Leuven",
    listingVisibility: "public",
    accessMode: "open",
    salesMode: "on_sale",
    salesStatus: "on_sale",
    salesBadge: "Tickets live",
    canBuyTickets: true,
    ticketingMode: "native",
    ticketInfo: "Na betaling ontvang je een bevestiging per e-mail. De uiteindelijke e-ticket mailflow koppelen we in de volgende stap.",
    ticketTypes: [
      {
        key: "regular",
        title: "Regular",
        description: "Toegang tot concertavond en bitesformule.",
        priceLabel: "27 euro",
        priceCents: 2700,
        availableQuantity: 62,
        isSoldOut: false
      }
    ]
  },
  {
    slug: "chefs-table-noordzee",
    dateLabel: "Donderdag 2 mei · 19:30",
    title: "Chef's Table: Noordzee Editie",
    intro: "Een exclusieve avond met 5 gangen, pairing en storytelling aan lange tafel.",
    priceLabel: "79 euro",
    availabilityLabel: "18 plaatsen",
    description: "Dit is het type event dat baat heeft bij een eigen verhaal, timing, tickettypes en beperkte capaciteit. In de echte build komt dit uit Sanity met voorraadkoppeling via Supabase.",
    ctaLabel: "Reserveer je stoel",
    venue: "In den Boule, Leuven",
    listingVisibility: "public",
    accessMode: "open",
    salesMode: "presale",
    salesStatus: "presale",
    salesBadge: "Presale",
    canBuyTickets: true,
    ticketingMode: "native",
    ticketTypes: [
      {
        key: "chefs-table",
        title: "Chef's Table",
        description: "5 gangen aan de lange tafel met pairing.",
        priceLabel: "79 euro",
        priceCents: 7900,
        availableQuantity: 18,
        isSoldOut: false
      }
    ]
  },
  {
    slug: "mothers-day-brunch",
    dateLabel: "Zondag 12 mei · 11:00",
    title: "Mother's Day Brunch",
    intro: "Familietafels, brunchbuffet en kinderformule met tijdssloten.",
    priceLabel: "42 euro",
    availabilityLabel: "3 slots",
    description: "Deze flow toont hoe events ook met varianten of tijdssloten gepresenteerd kunnen worden, zonder dat de homepage overvol raakt.",
    ctaLabel: "Boek brunchslot",
    venue: "In den Boule, Leuven",
    listingVisibility: "public",
    accessMode: "open",
    salesMode: "waitlist",
    salesStatus: "waitlist",
    salesBadge: "Wachtlijst",
    canBuyTickets: false,
    ticketingMode: "native",
    ticketTypes: [
      {
        key: "brunch",
        title: "Brunch",
        description: "Brunchtoegang per persoon.",
        priceLabel: "42 euro",
        priceCents: 4200,
        availableQuantity: 36,
        isSoldOut: false
      }
    ]
  }
];

export const eventMap = Object.fromEntries(events.map((event) => [event.slug, event]));
