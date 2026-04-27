import { defineArrayMember, defineField, defineType } from "sanity";

export const richTextType = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normaal", value: "normal" },
        { title: "Tussentitel", value: "h2" },
        { title: "Kleine titel", value: "h3" },
        { title: "Quote", value: "blockquote" }
      ],
      lists: [
        { title: "Opsomming", value: "bullet" },
        { title: "Genummerd", value: "number" }
      ],
      marks: {
        decorators: [
          { title: "Vet", value: "strong" },
          { title: "Cursief", value: "em" }
        ],
        annotations: [
          defineField({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) => Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] })
              })
            ]
          })
        ]
      }
    })
  ]
});
