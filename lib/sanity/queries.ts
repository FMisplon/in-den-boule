export const homePageQuery = `*[_type == "homePage"][0]{
  heroEyebrow,
  heroTitle,
  heroText,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  heroPoints,
  storyEyebrow,
  storyTitle,
  storyText,
  conceptEyebrow,
  conceptTitle,
  conceptCards,
  highlightsEyebrow,
  highlightsTitle,
  highlightCards,
  promotionsEyebrow,
  promotionsTitle,
  promotions[]{
    title,
    body,
    image,
    imageAlt,
    startsOn,
    endsOn,
    ctaLabel,
    ctaHref
  }
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteTitle,
  heroTagline,
  address,
  openingHours,
  contactEmail,
  contactPhone,
  legalEntityName,
  registeredOffice,
  companyNumber,
  vatNumber,
  gtmContainerId,
  pageHeroImages[]{
    pageKey,
    image,
    alt
  },
  socialProfiles[]{
    platform,
    url,
    label
  }
}`;

export const menuItemsQuery = `*[_type == "menuItem" && available != false] | order(sortOrder asc){
  _id,
  title,
  description,
  priceLabel,
  featured,
  image,
  tags,
  "category": category->title
}`;

export const shopProductsQuery = `*[_type == "shopProduct" && active == true] | order(title asc){
  _id,
  title,
  slug,
  productType,
  excerpt,
  active,
  priceOptions[]{
    label,
    amount
  }
}`;

export const eventsQuery = `*[_type == "event" && published == true && listingVisibility != "private"] | order(startsAt asc){
  _id,
  title,
  slug,
  startsAt,
  teaser,
  heroImage,
  venue,
  listingVisibility,
  accessMode,
  salesMode,
  primaryCtaLabel,
  ticketingMode,
  ticketUrl,
  ticketInfo,
  ticketTypes
}`;

export const eventSlugsQuery = `*[_type == "event" && published == true && defined(slug.current)]{
  "slug": slug.current
}`;
