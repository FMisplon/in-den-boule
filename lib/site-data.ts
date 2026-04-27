export type NavItem = {
  href: string;
  label: string;
};

export type MenuItem = {
  category: string;
  title: string;
  description: string;
  price: string;
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
};

export const site = {
  name: "In den Boule",
  tagline: "Join the legend",
  headerLine: "cafe · feest · keuken · events",
  address: "Augustijnenstraat 2, 3000 Leuven",
  hours: "Zondag: 20u-03u · Maandag - Donderdag: 11u-03u · Vrijdag & Zaterdag: gesloten",
  kitchen: "Altijd doorlopend open",
  contactEmail: "hallo@indenboule.be",
  contactPhone: "+32 494 86 98 46"
};

export const mainNav: NavItem[] = [
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/verhuur", label: "Verhuur" },
  { href: "/contact", label: "Contact" }
];

export const menuItems: MenuItem[] = [
  { category: "Pasta's", title: "Spaghetti Boule", description: "De legendarische huisfavoriet.", price: "13 euro" },
  { category: "Pasta's", title: "Spaghetti Boule Jumbo", description: "Voor wie honger meebrengt.", price: "19 euro" },
  { category: "Pasta's", title: "Vegetarische spaghetti", description: "De veggie variant op de klassieker.", price: "13 euro" },
  { category: "Pasta's", title: "Spaghetti kaassaus ham", description: "Comfort food met romige kaassaus.", price: "15 euro" },
  { category: "Oven", title: "Lasagne", description: "Klassieke lasagne uit de oven.", price: "15 euro" },
  { category: "Croques", title: "Croque Boule", description: "Met huisgemaakte bolognaisesaus, inclusief slaatje.", price: "13,5 euro" },
  { category: "Bagels", title: "Parmaham", description: "Pesto, mozzarella, tomaat en rucola.", price: "14 euro" },
  { category: "Snacks", title: "Nacho's", description: "Met guacamole, cheddar en tomatensalsa.", price: "7 / 9 euro" },
  { category: "Desserts", title: "Chocoladamousse met caramel", description: "Zoete afsluiter met zachte carameltoets.", price: "10 euro" }
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
    ctaLabel: "Koop ticket"
  },
  {
    slug: "chefs-table-noordzee",
    dateLabel: "Donderdag 2 mei · 19:30",
    title: "Chef's Table: Noordzee Editie",
    intro: "Een exclusieve avond met 5 gangen, pairing en storytelling aan lange tafel.",
    priceLabel: "79 euro",
    availabilityLabel: "18 plaatsen",
    description: "Dit is het type event dat baat heeft bij een eigen verhaal, timing, tickettypes en beperkte capaciteit. In de echte build komt dit uit Sanity met voorraadkoppeling via Supabase.",
    ctaLabel: "Reserveer je stoel"
  },
  {
    slug: "mothers-day-brunch",
    dateLabel: "Zondag 12 mei · 11:00",
    title: "Mother's Day Brunch",
    intro: "Familietafels, brunchbuffet en kinderformule met tijdssloten.",
    priceLabel: "42 euro",
    availabilityLabel: "3 slots",
    description: "Deze flow toont hoe events ook met varianten of tijdssloten gepresenteerd kunnen worden, zonder dat de homepage overvol raakt.",
    ctaLabel: "Boek brunchslot"
  }
];

export const eventMap = Object.fromEntries(events.map((event) => [event.slug, event]));
