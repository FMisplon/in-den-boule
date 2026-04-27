import { cache } from "react";
import { events as fallbackEvents, eventMap, menuItems as fallbackMenuItems, site as fallbackSite } from "@/lib/site-data";
import { sanityClient } from "@/lib/sanity/client";
import { eventsQuery, menuItemsQuery, siteSettingsQuery } from "@/lib/sanity/queries";

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
  primaryCtaLabel?: string;
  ticketingMode?: "native" | "external" | "info";
  ticketUrl?: string;
  ticketInfo?: string;
  ticketTypes?: SanityEventTicketType[];
  body?: unknown[];
};

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
  const totalAvailability = (event.ticketTypes || []).reduce(
    (sum, ticket) => sum + (ticket.availableQuantity || 0),
    0
  );

  return {
    slug,
    title: event.title,
    intro: event.teaser,
    description: event.teaser,
    ctaLabel: event.primaryCtaLabel || "Koop ticket",
    dateLabel: formatEventDate(event.startsAt),
    priceLabel: firstTicket?.priceLabel || "Prijs volgt",
    availabilityLabel:
      totalAvailability > 0 ? `${totalAvailability} tickets beschikbaar` : "Beperkte plaatsen",
    venue: event.venue || "In den Boule, Leuven",
    ticketingMode: event.ticketingMode || "native",
    ticketUrl: event.ticketUrl,
    ticketInfo: event.ticketInfo,
    ticketTypes: (event.ticketTypes || []).map((ticket, index) => ({
      key: ticket._key || `${slug}-${index}`,
      title: ticket.title,
      description: ticket.description,
      priceLabel: ticket.priceLabel,
      priceCents: ticket.priceCents,
      availableQuantity: ticket.availableQuantity
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

export const getEventBySlug = cache(async (slug: string) => {
  try {
    const data = await sanityClient.fetch<SanityEvent | null>(
      `*[_type == "event" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        startsAt,
        teaser,
        venue,
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
