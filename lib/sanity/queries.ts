export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteTitle,
  heroTagline,
  address,
  openingHours,
  contactEmail,
  contactPhone
}`;

export const menuItemsQuery = `*[_type == "menuItem" && available == true] | order(sortOrder asc){
  _id,
  title,
  description,
  priceLabel,
  featured,
  displayLabel,
  "category": category->title
}`;

export const eventsQuery = `*[_type == "event" && published == true && listingVisibility != "private"] | order(startsAt asc){
  _id,
  title,
  slug,
  startsAt,
  teaser,
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
