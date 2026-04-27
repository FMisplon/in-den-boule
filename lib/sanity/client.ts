import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { env } from "@/lib/env";

export const sanityClient = createClient({
  projectId: env.sanityProjectId,
  dataset: env.sanityDataset,
  apiVersion: "2026-04-27",
  useCdn: false,
  token: env.sanityApiToken
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  return builder.image(source as never);
}
