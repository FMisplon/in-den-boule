import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("In den Boule")
    .items([
      S.listItem()
        .title("Site settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Menu")
        .child(
          S.list()
            .title("Menu")
            .items([
              S.documentTypeListItem("menuCategory").title("Categorieen"),
              S.documentTypeListItem("menuItem").title("Menu-items")
            ])
        ),
      S.listItem().title("Events").child(S.documentTypeList("event").title("Events")),
      S.listItem().title("Shop").child(S.documentTypeList("shopProduct").title("Shopproducten"))
    ]);
