import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("In den Boule")
    .items([
      S.listItem()
        .title("Homepage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Verhuurpagina")
        .child(S.document().schemaType("venuePage").documentId("venuePage")),
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
              S.listItem()
                .title("Beschikbare menu-items")
                .child(
                  S.documentList()
                    .title("Beschikbare menu-items")
                    .schemaType("menuItem")
                    .filter('_type == "menuItem" && available == true')
                    .defaultOrdering([
                      { field: "category.title", direction: "asc" },
                      { field: "sortOrder", direction: "asc" }
                    ])
                ),
              S.listItem()
                .title("Verborgen menu-items")
                .child(
                  S.documentList()
                    .title("Verborgen menu-items")
                    .schemaType("menuItem")
                    .filter('_type == "menuItem" && available != true')
                    .defaultOrdering([{ field: "title", direction: "asc" }])
                )
            ])
        ),
      S.listItem()
        .title("Events")
        .child(
          S.list()
            .title("Events")
            .items([
              S.listItem()
                .title("Publieke events")
                .child(
                  S.documentList()
                    .title("Publieke events")
                    .schemaType("event")
                    .filter('_type == "event" && published == true')
                    .defaultOrdering([{ field: "startsAt", direction: "asc" }])
                ),
              S.listItem()
                .title("Verborgen / concept events")
                .child(
                  S.documentList()
                    .title("Verborgen / concept events")
                    .schemaType("event")
                    .filter('_type == "event" && published != true')
                    .defaultOrdering([{ field: "startsAt", direction: "desc" }])
                )
            ])
        ),
      S.listItem()
        .title("Shop")
        .child(
          S.list()
            .title("Shop")
            .items([
              S.listItem()
                .title("Actieve shopproducten")
                .child(
                  S.documentList()
                    .title("Actieve shopproducten")
                    .schemaType("shopProduct")
                    .filter('_type == "shopProduct" && active == true')
                    .defaultOrdering([{ field: "title", direction: "asc" }])
                ),
              S.listItem()
                .title("Niet actieve shopproducten")
                .child(
                  S.documentList()
                    .title("Niet actieve shopproducten")
                    .schemaType("shopProduct")
                    .filter('_type == "shopProduct" && active != true')
                    .defaultOrdering([{ field: "title", direction: "asc" }])
                )
            ])
        )
    ]);
