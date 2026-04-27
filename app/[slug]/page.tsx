import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/event-detail-view";
import { createEventAccessToken, getEventAccessCookieName } from "@/lib/event-access";
import { getAllEventSlugs, getEventBySlug } from "@/lib/sanity/loaders";

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PublicEventSlugPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const requiresPassword = event.accessMode === "password";
  let isUnlocked = true;

  if (requiresPassword) {
    const cookieStore = await cookies();
    const accessCookie = cookieStore.get(getEventAccessCookieName(slug))?.value;
    const accessPassword =
      "accessPassword" in event && typeof event.accessPassword === "string"
        ? event.accessPassword
        : "";

    isUnlocked = Boolean(
      accessCookie &&
        accessPassword &&
        accessCookie === createEventAccessToken(slug, accessPassword)
    );
  }

  return <EventDetailView event={event} isUnlocked={isUnlocked} />;
}
