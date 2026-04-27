export type NavItem = {
  href: string;
  label: string;
};

export type MenuItem = {
  category: string;
  label?: string;
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
  { category: "Pasta's", label: "Soep", title: "Dagsoep met brood", description: "Een eenvoudige starter voor wie licht wil beginnen.", price: "6 euro" },
  { category: "Pasta's", label: "Pasta's", title: "Spaghetti Boule", description: "De legendarische huisfavoriet.", price: "13 euro" },
  { category: "Pasta's", label: "Pasta's", title: "Spaghetti Boule Jumbo", description: "Voor wie honger meebrengt.", price: "19 euro" },
  { category: "Pasta's", label: "Pasta's", title: "Vegetarische spaghetti", description: "De veggie variant op de klassieker.", price: "13 euro" },
  { category: "Pasta's", label: "Pasta's", title: "Spaghetti kaassaus ham", description: "Comfort food met romige kaassaus.", price: "15 euro" },
  { category: "Pasta's", label: "Pasta's", title: "Spaghetti kip tomaat mascarpone", description: "Een zachte saus met kip en mascarpone.", price: "15 euro" },
  { category: "Pasta's", label: "Oven", title: "Lasagne", description: "Klassieke lasagne uit de oven.", price: "15 euro" },
  { category: "Pasta's", label: "Oven", title: "Vegetarische lasagne", description: "De veggie versie van de huislasagne.", price: "15 euro" },
  { category: "Croques", label: "Croques", title: "Uitsmijter", description: "Boerenbrood, 2 spiegeleieren, hesp, kaas en guacamole.", price: "15 euro" },
  { category: "Croques", label: "Croques", title: "Croque uit 't vuistje", description: "Kleine snelle croque voor tussendoor.", price: "6,5 euro" },
  { category: "Croques", label: "Croques", title: "Croque Monsieur", description: "Ham en kaas, inclusief slaatje.", price: "10,5 euro" },
  { category: "Croques", label: "Croques", title: "Croque Madame", description: "Enkel kaas, inclusief slaatje.", price: "10,5 euro" },
  { category: "Croques", label: "Croques", title: "Croque Cheval", description: "Met spiegelei, inclusief slaatje.", price: "12,5 euro" },
  { category: "Croques", label: "Croques", title: "Croque Boule", description: "Met huisgemaakte bolognaisesaus, inclusief slaatje.", price: "13,5 euro" },
  { category: "Bagels", label: "Bagels", title: "Gehaktbal", description: "Met joppiesaus en bickyajuin, inclusief slaatje.", price: "12 euro" },
  { category: "Bagels", label: "Bagels", title: "Parmaham", description: "Pesto, mozzarella, tomaat en rucola.", price: "14 euro" },
  { category: "Bagels", label: "Bagels", title: "Rosbief", description: "Truffelmayonaise, rucola en parmezaan.", price: "14 euro" },
  { category: "Bagels", label: "Bagels", title: "Kip", description: "Guacamole, parmezaan, rucola en zongedroogde tomaat.", price: "14 euro" },
  { category: "Bagels", label: "Bagels", title: "Boule", description: "Spek, spiegelei, cheddar, guacamole en tomaat.", price: "12 euro" },
  { category: "Snacks", label: "Kroketjes", title: "Kaaskroketten", description: "2 of 3 stuks, inclusief slaatje en brood.", price: "15 / 18 euro" },
  { category: "Snacks", label: "Kroketjes", title: "Garnaalkroketten", description: "2 of 3 stuks, inclusief slaatje en brood.", price: "18 / 22 euro" },
  { category: "Snacks", label: "Kroketjes", title: "Stoofvleeskroketten", description: "2 of 3 stuks, inclusief slaatje en brood.", price: "18 / 22 euro" },
  { category: "Snacks", label: "Snacks", title: "Chips", description: "Een kleine snack bij het glas.", price: "3 euro" },
  { category: "Snacks", label: "Snacks", title: "Nacho's", description: "Met guacamole, cheddar en tomatensalsa.", price: "7 / 9 euro" },
  { category: "Snacks", label: "Snacks", title: "Portie kaas", description: "Klassieke borrelplank-basis.", price: "8 euro" },
  { category: "Snacks", label: "Snacks", title: "Portie salami", description: "Voor bij de apero.", price: "9 euro" },
  { category: "Snacks", label: "Snacks", title: "Portie gemengd", description: "Kaas en salami samen.", price: "10 euro" },
  { category: "Snacks", label: "Snacks", title: "Portie kaasballetjes", description: "8 stuks.", price: "10 euro" },
  { category: "Snacks", label: "Snacks", title: "Portie garnaalballetjes", description: "8 stuks.", price: "12 euro" },
  { category: "Snacks", label: "Snacks", title: "Boulet met tartaar", description: "Een snelle klassieker voor tussendoor.", price: "6,5 euro" },
  { category: "Desserts", label: "Desserts", title: "Chocoladamousse met caramel", description: "Zoete afsluiter met zachte carameltoets.", price: "10 euro" },
  { category: "Desserts", label: "Desserts", title: "Verwenkoffie", description: "Koffie met 4 kleine dessertjes.", price: "9 euro" }
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
