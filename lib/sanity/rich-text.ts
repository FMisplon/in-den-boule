export type RichTextMarkDef = {
  _key?: string;
  _type?: string;
  href?: string;
};

export type RichTextSpan = {
  _key?: string;
  _type?: "span";
  text?: string;
  marks?: string[];
};

export type RichTextBlock = {
  _key?: string;
  _type?: "block";
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  children?: RichTextSpan[];
  markDefs?: RichTextMarkDef[];
};

export type RichTextValue = RichTextBlock[];

export function isRichTextValue(value: unknown): value is RichTextValue {
  return Array.isArray(value);
}

export function richTextToPlainText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!isRichTextValue(value)) {
    return "";
  }

  return value
    .map((block) =>
      (block.children || [])
        .map((child) => child.text || "")
        .join("")
        .trim()
    )
    .filter(Boolean)
    .join("\n\n")
    .trim();
}
