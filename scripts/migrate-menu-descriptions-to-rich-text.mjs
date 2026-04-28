import { createClient } from "@sanity/client";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "817hu0y2";
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const sanityApiToken = process.env.SANITY_API_TOKEN;

if (!sanityApiToken) {
  throw new Error("Missing SANITY_API_TOKEN");
}

const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2026-04-27",
  useCdn: false,
  token: sanityApiToken
});

function toPortableText(text) {
  return [
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text
        }
      ],
      markDefs: []
    }
  ];
}

const query = `*[
  _type == "menuItem" || (_id in path("drafts.**") && _type == "menuItem")
]{
  _id,
  title,
  description
}`;

const documents = await client.fetch(query, {}, { perspective: "raw" });

let updated = 0;

for (const document of documents) {
  if (typeof document?.description !== "string") {
    continue;
  }

  const description = document.description.trim();

  if (!description) {
    continue;
  }

  await client.patch(document._id).set({ description: toPortableText(description) }).commit();
  updated += 1;
  console.log(`Converted ${document._id} (${document.title})`);
}

console.log(`Done. ${updated} menu-item beschrijving(en) omgezet naar rich text.`);
