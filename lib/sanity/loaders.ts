import { cache } from "react";
import {
  events as fallbackEvents,
  homePage as fallbackHomePage,
  type HomePageConfig,
  type PageHeroKey,
  eventMap,
  menuItems as fallbackMenuItems,
  shopProducts as fallbackShopProducts,
  type ShopProductItem,
  site as fallbackSite
} from "@/lib/site-data";
import { sanityClient, urlFor } from "@/lib/sanity/client";
import {
  eventSlugsQuery,
  eventsQuery,
  homePageQuery,
  menuItemsQuery,
  shopProductsQuery,
  siteSettingsQuery
} from "@/lib/sanity/queries";
import { richTextToPlainText, type RichTextValue } from "@/lib/sanity/rich-text";

const SANITY_REVALIDATE_SECONDS = 60;
const SANITY_FETCH_OPTIONS = {
  next: { revalidate: SANITY_REVALIDATE_SECONDS }
};

function getSocialLabel(platform: "instagram" | "facebook" | "tiktok" | "linkedin" | "youtube") {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "tiktok":
      return "TikTok";
    case "linkedin":
      return "LinkedIn";
    case "youtube":
      return "YouTube";
  }
}

type SanitySiteSettings = {
  siteTitle?: string;
  heroTagline?: string;
  address?: string;
  openingHours?: string;
  contactEmail?: string;
  contactPhone?: string;
  legalEntityName?: string;
  registeredOffice?: string;
  companyNumber?: string;
  vatNumber?: string;
  gtmContainerId?: string;
  pageHeroImages?: Array<{
    pageKey?: PageHeroKey;
    image?: unknown;
    alt?: string;
  }>;
  socialProfiles?: Array<{
    platform?: "instagram" | "facebook" | "tiktok" | "linkedin" | "youtube";
    url?: string;
    label?: string;
  }>;
};

type SanityHomePageCard = {
  eyebrow?: string;
  title?: string;
  body?: string | RichTextValue;
  ctaLabel?: string;
  ctaHref?: string;
};

type SanityHomePage = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroText?: string | RichTextValue;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  heroPoints?: string[];
  storyEyebrow?: string;
  storyTitle?: string;
  storyText?: string | RichTextValue;
  conceptEyebrow?: string;
  conceptTitle?: string;
  conceptCards?: SanityHomePageCard[];
  highlightsEyebrow?: string;
  highlightsTitle?: string;
  highlightCards?: SanityHomePageCard[];
};

type SanityMenuItem = {
  _id: string;
  title: string;
  description?: string | RichTextValue;
  priceLabel: string;
  category?: string;
  image?: unknown;
};

type SanityShopProduct = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  productType?: "gift-card-digital" | "physical";
  excerpt?: string | RichTextValue;
  active?: boolean;
  priceOptions?: Array<{
    label?: string;
    amount?: number;
  }>;
};

type SanityEventTicketType = {
  _key?: string;
  title: string;
  priceLabel: string;
  priceCents?: number;
  description?: string | RichTextValue;
  availableQuantity?: number;
};

type SanityEvent = {
  _id: string;
  title: string;
  slug?: { current?: string };
  startsAt: string;
  teaser: string | RichTextValue;
  heroImage?: unknown;
  venue?: string;
  listingVisibility?: "public" | "private";
  accessMode?: "open" | "password";
  accessPassword?: string;
  salesMode?: "on_sale" | "presale" | "waitlist";
  primaryCtaLabel?: string;
  ticketingMode?: "native" | "external" | "info";
  ticketUrl?: string;
  ticketInfo?: string | RichTextValue;
  ticketTypes?: SanityEventTicketType[];
  body?: RichTextValue;
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
    const isPrivatePresale =
      event.listingVisibility === "private" || event.accessMode === "password";

    return {
      status: "presale" as const,
      badge: isPrivatePresale ? "Private presale" : "Presale",
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
    intro: richTextToPlainText(event.teaser),
    description: richTextToPlainText(event.teaser),
    descriptionRich: Array.isArray(event.teaser) ? event.teaser : undefined,
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
    heroImageUrl: event.heroImage
      ? urlFor(event.heroImage).width(2400).height(1200).fit("crop").url()
      : undefined,
    body: event.body,
    ticketingMode: event.ticketingMode || "native",
    ticketUrl: event.ticketUrl,
    ticketInfo: richTextToPlainText(event.ticketInfo),
    ticketInfoRich: Array.isArray(event.ticketInfo) ? event.ticketInfo : undefined,
    ticketTypes: (event.ticketTypes || []).map((ticket, index) => ({
      key: ticket._key || `${slug}-${index}`,
      title: ticket.title,
      description: richTextToPlainText(ticket.description),
      descriptionRich: Array.isArray(ticket.description) ? ticket.description : undefined,
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

function mergeHomeCards(
  cards: SanityHomePageCard[] | undefined,
  fallbackCards: HomePageConfig["conceptCards"]
) {
  if (!cards?.length) {
    return fallbackCards;
  }

  return cards
    .map((card, index) => ({
      eyebrow: card.eyebrow || fallbackCards[index]?.eyebrow,
      title: card.title || fallbackCards[index]?.title,
      body: richTextToPlainText(card.body) || fallbackCards[index]?.body,
      bodyRich: Array.isArray(card.body) ? card.body : fallbackCards[index]?.bodyRich,
      ctaLabel: card.ctaLabel || fallbackCards[index]?.ctaLabel,
      ctaHref: card.ctaHref || fallbackCards[index]?.ctaHref
    }))
    .filter((card) => card.title && card.body) as HomePageConfig["conceptCards"];
}

export const getHomePage = cache(async () => {
  try {
    const data = await sanityClient.fetch<SanityHomePage | null>(
      homePageQuery,
      {},
      SANITY_FETCH_OPTIONS
    );

    if (!data) {
      return fallbackHomePage;
    }

    return {
      heroEyebrow: data.heroEyebrow || fallbackHomePage.heroEyebrow,
      heroTitle: data.heroTitle || fallbackHomePage.heroTitle,
      heroText: richTextToPlainText(data.heroText) || fallbackHomePage.heroText,
      heroTextRich: Array.isArray(data.heroText) ? data.heroText : fallbackHomePage.heroTextRich,
      primaryCtaLabel: data.primaryCtaLabel || fallbackHomePage.primaryCtaLabel,
      primaryCtaHref: data.primaryCtaHref || fallbackHomePage.primaryCtaHref,
      secondaryCtaLabel: data.secondaryCtaLabel || fallbackHomePage.secondaryCtaLabel,
      secondaryCtaHref: data.secondaryCtaHref || fallbackHomePage.secondaryCtaHref,
      heroPoints:
        data.heroPoints?.filter(Boolean).length ? data.heroPoints.filter(Boolean) : fallbackHomePage.heroPoints,
      storyEyebrow: data.storyEyebrow || fallbackHomePage.storyEyebrow,
      storyTitle: data.storyTitle || fallbackHomePage.storyTitle,
      storyText: richTextToPlainText(data.storyText) || fallbackHomePage.storyText,
      storyTextRich: Array.isArray(data.storyText) ? data.storyText : fallbackHomePage.storyTextRich,
      conceptEyebrow: data.conceptEyebrow || fallbackHomePage.conceptEyebrow,
      conceptTitle: data.conceptTitle || fallbackHomePage.conceptTitle,
      conceptCards: mergeHomeCards(data.conceptCards, fallbackHomePage.conceptCards),
      highlightsEyebrow: data.highlightsEyebrow || fallbackHomePage.highlightsEyebrow,
      highlightsTitle: data.highlightsTitle || fallbackHomePage.highlightsTitle,
      highlightCards: mergeHomeCards(data.highlightCards, fallbackHomePage.highlightCards)
    };
  } catch {
    return fallbackHomePage;
  }
});

export const getSiteSettings = cache(async () => {
  try {
    const data = await sanityClient.fetch<SanitySiteSettings | null>(
      siteSettingsQuery,
      {},
      SANITY_FETCH_OPTIONS
    );

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
      contactPhone: data.contactPhone || fallbackSite.contactPhone,
      legalEntityName: data.legalEntityName?.trim() || fallbackSite.legalEntityName,
      registeredOffice: data.registeredOffice?.trim() || fallbackSite.registeredOffice,
      companyNumber: data.companyNumber?.trim() || fallbackSite.companyNumber,
      vatNumber: data.vatNumber?.trim() || fallbackSite.vatNumber,
      gtmContainerId: data.gtmContainerId?.trim() || fallbackSite.gtmContainerId,
      pageHeroImages:
        data.pageHeroImages
          ?.filter(
            (entry): entry is NonNullable<SanitySiteSettings["pageHeroImages"]>[number] =>
              Boolean(entry?.pageKey && entry?.image)
          )
          .map((entry) => ({
            pageKey: entry.pageKey!,
            imageUrl: urlFor(entry.image).width(2400).height(1200).fit("crop").url(),
            alt: entry.alt?.trim() || ""
          })) || fallbackSite.pageHeroImages,
      socialProfiles:
        data.socialProfiles
          ?.filter(
            (profile): profile is NonNullable<SanitySiteSettings["socialProfiles"]>[number] =>
              Boolean(profile?.platform && profile?.url)
          )
          .map((profile) => ({
            platform: profile.platform!,
            url: profile.url!,
            label: profile.label?.trim() || getSocialLabel(profile.platform!)
          })) || fallbackSite.socialProfiles
    };
  } catch {
    return fallbackSite;
  }
});

export const getMenuItems = cache(async () => {
  try {
    const data = await sanityClient.fetch<SanityMenuItem[]>(menuItemsQuery, {}, SANITY_FETCH_OPTIONS);

    if (!data?.length) {
      return fallbackMenuItems;
    }

    return data.map((item) => ({
      category: item.category || "Menu",
      title: item.title,
      description: richTextToPlainText(item.description),
      price: item.priceLabel,
      imageUrl: item.image ? urlFor(item.image).width(900).height(720).fit("crop").url() : undefined
    }));
  } catch {
    return fallbackMenuItems;
  }
});

export const getShopProducts = cache(async (): Promise<ShopProductItem[]> => {
  try {
    const data = await sanityClient.fetch<SanityShopProduct[]>(
      shopProductsQuery,
      {},
      SANITY_FETCH_OPTIONS
    );

    const mapped: ShopProductItem[] = data
      .map((product) => {
        const slug = product.slug?.current?.trim();
        const title = product.title?.trim();

        if (!slug || !title || !product.productType) {
          return null;
        }

        return {
          id: product._id,
          title,
          slug,
          productType: product.productType,
          excerpt: richTextToPlainText(product.excerpt),
          excerptRich: Array.isArray(product.excerpt) ? product.excerpt : undefined,
          active: product.active !== false,
          priceOptions: (product.priceOptions || [])
            .filter(
              (
                option
              ): option is {
                label: string;
                amount: number;
              } => Boolean(option?.label && typeof option.amount === "number" && option.amount > 0)
            )
            .map((option) => ({
              label: option.label.trim(),
              amount: option.amount
            }))
        };
      })
      .filter((product): product is NonNullable<typeof product> => Boolean(product));

    if (mapped.length) {
      return mapped;
    }

    return fallbackShopProducts;
  } catch {
    return fallbackShopProducts;
  }
});

export const getEvents = cache(async () => {
  try {
    const data = await sanityClient.fetch<SanityEvent[]>(eventsQuery, {}, SANITY_FETCH_OPTIONS);
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
    const data = await sanityClient.fetch<Array<{ slug?: string }>>(
      eventSlugsQuery,
      {},
      SANITY_FETCH_OPTIONS
    );
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
        heroImage,
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
      { slug },
      SANITY_FETCH_OPTIONS
    );

    if (!data) {
      return eventMap[slug] || null;
    }

    return toEventSummary(data);
  } catch {
    return eventMap[slug] || null;
  }
});

export const getPageHeroImage = cache(async (pageKey: PageHeroKey) => {
  const site = await getSiteSettings();
  return site.pageHeroImages.find((entry) => entry.pageKey === pageKey) || null;
});
