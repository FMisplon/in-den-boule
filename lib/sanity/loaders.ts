import { cache } from "react";
import {
  events as fallbackEvents,
  eventMap,
  menuItems as fallbackMenuItems,
  site as fallbackSite
} from "@/lib/site-data";
import { sanityClient } from "@/lib/sanity/client";
import {
  eventSlugsQuery,
  eventsQuery,
  menuItemsQuery,
  siteSettingsQuery
} from "@/lib/sanity/queries";

type SanitySiteSettings = {
  siteTitle?: string;
  heroTagline?: string;
  address?: string;
  openingHours?: string;
  contactEmail?: string;
  contactPhone?: string;
};

type SanityMenuItem = {
  _id: string;
  title: string;
  description?: string;
  priceLabel: string;
  displayLabel?: string;
  category?: string;
};

type SanityEventTicketType = {
  _key?: string;
  title: string;
  priceLabel: string;
  priceCents?: number;
  description?: string;
  availableQuantity?: number;
};

type SanityEvent = {
  _id: string;
  title: string;
  slug?: { current?: string };
  startsAt: string;
  teaser: string;
  venue?: string;
  listingVisibility?: "public" | "private";
  accessMode?: "open" | "password";
  accessPassword?: string;
  salesMode?: "on_sale" | "presale" | "waitlist";
  primaryCtaLabel?: string;
  ticketingMode?: "native" | "external" | "info";
  ticketUrl?: string;
  ticketInfo?: string;
  ticketTypes?: SanityEventTicketType[];
  body?: unknown[];
};

function resolveEventSalesStatus(event: SanityEvent) {
  const totalAvailability = (event.ticketTypes || []).reduce(
    (sum, ticket) => sum + (ticket.availableQuantity || 0),
    0
  );

  if (totalAvailability <= 0 && (event.ticketTypes?.length || 0) > 0) {
    return {
      status: "sold_out" as const,
      badge: "Uitverkocht",
      canBuyTickets: false,
      availabilityLabel: "Uitverkocht"
    };
  }

  if (event.salesMode === "waitlist") {
    return {
      status: "waitlist" as const,
      badge: "Wachtlijst",
      canBuyTickets: false,
      availabilityLabel:
        totalAvailability > 0 ? `${totalAvailability} plaatsen op aanvraag` : "Wachtlijst"
    };
  }

  if (event.salesMode === "presale") {
    return {
      status: "presale" as const,
      badge: "Presale",
      canBuyTickets: true,
      availabilityLabel:
        totalAvailability > 0 ? `${totalAvailability} tickets beschikbaar` : "Presale"
    };
  }

  return {
    status: "on_sale" as const,
    badge: "Tickets live",
    canBuyTickets: true,
    availabilityLabel:
      totalAvailability > 0 ? `${totalAvailability} tickets beschikbaar` : "Beperkte plaatsen"
  };
}

function formatEventDate(dateValue: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Brussels"
  }).format(new Date(dateValue));
}

function toEventSummary(event: SanityEvent) {
  const slug = event.slug?.current;

  if (!slug) {
    return null;
  }

  const firstTicket = event.ticketTypes?.[0];
  const sales = resolveEventSalesStatus(event);

  return {
    slug,
    title: event.title,
    intro: event.teaser,
    description: event.teaser,
    ctaLabel: event.primaryCtaLabel || "Koop ticket",
    dateLabel: formatEventDate(event.startsAt),
    priceLabel: firstTicket?.priceLabel || "Prijs volgt",
    availabilityLabel: sales.availabilityLabel,
    venue: event.venue || "In den Boule, Leuven",
    listingVisibility: event.listingVisibility || "public",
    accessMode: event.accessMode || "open",
    accessPassword: event.accessPassword,
    salesMode: event.salesMode || "on_sale",
    salesStatus: sales.status,
    salesBadge: sales.badge,
    canBuyTickets: sales.canBuyTickets,
    ticketingMode: event.ticketingMode || "native",
    ticketUrl: event.ticketUrl,
    ticketInfo: event.ticketInfo,
    ticketTypes: (event.ticketTypes || []).map((ticket, index) => ({
      key: ticket._key || `${slug}-${index}`,
      title: ticket.title,
      description: ticket.description,
      priceLabel: ticket.priceLabel,
      priceCents: ticket.priceCents,
      availableQuantity: ticket.availableQuantity,
      isSoldOut: (ticket.availableQuantity || 0) <= 0
    }))
  };
}

function isEventSummary(
  value: ReturnType<typeof toEventSummary>
): value is NonNullable<ReturnType<typeof toEventSummary>> {
  return value !== null;
}

export const getSiteSettings = cache(async () => {
  try {
    const data = await sanityClient.fetch<SanitySiteSettings | null>(siteSettingsQuery);

    if (!data) {
      return fallbackSite;
    }

    return {
      name: data.siteTitle || fallbackSite.name,
      tagline: data.heroTagline || fallbackSite.tagline,
      headerLine: fallbackSite.headerLine,
      address: data.address || fallbackSite.address,
      hours: data.openingHours || fallbackSite.hours,
      kitchen: fallbackSite.kitchen,
      contactEmail: data.contactEmail || fallbackSite.contactEmail,
      contactPhone: data.contactPhone || fallbackSite.contactPhone
    };
  } catch {
    return fallbackSite;
  }
});

export const getMenuItems = cache(async () => {
  try {
    const data = await sanityClient.fetch<SanityMenuItem[]>(menuItemsQuery);

    if (!data?.length) {
      return fallbackMenuItems;
    }

    return data.map((item) => ({
      category: item.category || "Menu",
      label: item.displayLabel || item.category || "Menu",
      title: item.title,
      description: item.description || "",
      price: item.priceLabel
    }));
  } catch {
    return fallbackMenuItems;
  }
});

export const getEvents = cache(async () => {
  try {
    const data = await sanityClient.fetch<SanityEvent[]>(eventsQuery);
    const mapped = data.map(toEventSummary).filter(isEventSummary);

    if (!mapped.length) {
      return fallbackEvents;
    }

    return mapped;
  } catch {
    return fallbackEvents;
  }
});

export const getAllEventSlugs = cache(async () => {
  try {
    const data = await sanityClient.fetch<Array<{ slug?: string }>>(eventSlugsQuery);
    const slugs = data
      .map((item) => item.slug?.trim())
      .filter((value): value is string => Boolean(value));

    if (slugs.length) {
      return slugs;
    }

    return fallbackEvents.map((event) => event.slug);
  } catch {
    return fallbackEvents.map((event) => event.slug);
  }
});

export const getEventBySlug = cache(async (slug: string) => {
  try {
    const data = await sanityClient.fetch<SanityEvent | null>(
      `*[_type == "event" && published == true && slug.current == $slug][0]{
        _id,
        title,
        slug,
        startsAt,
        teaser,
        venue,
        listingVisibility,
        accessMode,
        accessPassword,
        salesMode,
        primaryCtaLabel,
        ticketingMode,
        ticketUrl,
        ticketInfo,
        ticketTypes,
        body
      }`,
      { slug }
    );

    if (!data) {
      return eventMap[slug] || null;
    }

    return toEventSummary(data);
  } catch {
    return eventMap[slug] || null;
  }
});
