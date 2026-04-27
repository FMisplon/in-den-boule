import { redirect } from "next/navigation";
import { getAllEventSlugs, getEventBySlug } from "@/lib/sanity/loaders";

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    redirect("/events");
  }

  redirect(`/${event.slug}`);
}
