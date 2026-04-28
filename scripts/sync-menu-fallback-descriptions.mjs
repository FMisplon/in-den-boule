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

const fallbackDescriptions = new Map([
  ["Dagsoep met brood", "Een eenvoudige starter voor wie licht wil beginnen."],
  ["Spaghetti Boule", "De legendarische huisfavoriet."],
  ["Spaghetti Boule Jumbo", "Voor wie honger meebrengt."],
  ["Vegetarische spaghetti", "De veggie variant op de klassieker."],
  ["Spaghetti kaassaus ham", "Comfort food met romige kaassaus."],
  ["Spaghetti kip tomaat mascarpone", "Een zachte saus met kip en mascarpone."],
  ["Lasagne", "Klassieke lasagne uit de oven."],
  ["Vegetarische lasagne", "De veggie versie van de huislasagne."],
  ["Uitsmijter", "Boerenbrood, 2 spiegeleieren, hesp, kaas en guacamole."],
  ["Croque uit 't vuistje", "Kleine snelle croque voor tussendoor."],
  ["Croque Monsieur", "Ham en kaas, inclusief slaatje."],
  ["Croque Madame", "Enkel kaas, inclusief slaatje."],
  ["Croque Cheval", "Met spiegelei, inclusief slaatje."],
  ["Croque Boule", "Met huisgemaakte bolognaisesaus, inclusief slaatje."],
  ["Gehaktbal", "Met joppiesaus en bickyajuin, inclusief slaatje."],
  ["Parmaham", "Pesto, mozzarella, tomaat en rucola."],
  ["Rosbief", "Truffelmayonaise, rucola en parmezaan."],
  ["Kip", "Guacamole, parmezaan, rucola en zongedroogde tomaat."],
  ["Boule", "Spek, spiegelei, cheddar, guacamole en tomaat."],
  ["Kaaskroketten", "2 of 3 stuks, inclusief slaatje en brood."],
  ["Garnaalkroketten", "2 of 3 stuks, inclusief slaatje en brood."],
  ["Stoofvleeskroketten", "2 of 3 stuks, inclusief slaatje en brood."],
  ["Chips", "Een kleine snack bij het glas."],
  ["Nacho's", "Met guacamole, cheddar en tomatensalsa."],
  ["Portie kaas", "Klassieke borrelplank-basis."],
  ["Portie salami", "Voor bij de apero."],
  ["Portie gemengd", "Kaas en salami samen."],
  ["Portie kaasballetjes", "8 stuks."],
  ["Portie garnaalballetjes", "8 stuks."],
  ["Boulet met tartaar", "Een snelle klassieker voor tussendoor."],
  ["Chocoladamousse met caramel", "Zoete afsluiter met zachte carameltoets."],
  ["Verwenkoffie", "Koffie met 4 kleine dessertjes."]
]);

function isDescriptionEmpty(description) {
  if (!description) {
    return true;
  }

  if (typeof description === "string") {
    return description.trim().length === 0;
  }

  if (!Array.isArray(description)) {
    return true;
  }

  const plainText = description
    .flatMap((block) => (Array.isArray(block?.children) ? block.children : []))
    .map((child) => child?.text || "")
    .join("")
    .trim();

  return plainText.length === 0;
}

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
  const title = document?.title?.trim();

  if (!title) {
    continue;
  }

  const fallbackDescription = fallbackDescriptions.get(title);

  if (!fallbackDescription || !isDescriptionEmpty(document.description)) {
    continue;
  }

  await client.patch(document._id).set({ description: toPortableText(fallbackDescription) }).commit();
  updated += 1;
  console.log(`Updated ${document._id} (${title})`);
}

console.log(`Done. ${updated} menu-item document(en) aangevuld.`);
