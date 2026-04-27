import type { ReactNode } from "react";
import { Fragment } from "react";
import type { RichTextBlock, RichTextMarkDef, RichTextValue } from "@/lib/sanity/rich-text";

type RichTextContentProps = {
  value?: RichTextValue;
  className?: string;
};

function renderSpans(block: RichTextBlock) {
  const markDefMap = new Map(
    (block.markDefs || []).map((definition) => [definition._key, definition] as const)
  );

  return (block.children || []).map((span, index) => {
    const text = span.text || "";
    const marks = span.marks || [];
    const key = span._key || `${block._key || "block"}-${index}`;

    return marks.reduce<ReactNode>((content, mark) => {
      if (mark === "strong") {
        return <strong key={`${key}-strong`}>{content}</strong>;
      }

      if (mark === "em") {
        return <em key={`${key}-em`}>{content}</em>;
      }

      const definition = markDefMap.get(mark);
      if (definition?._type === "link" && definition.href) {
        return (
          <a key={`${key}-link`} href={definition.href} target="_blank" rel="noreferrer">
            {content}
          </a>
        );
      }

      return content;
    }, <Fragment key={key}>{text}</Fragment>);
  });
}

function renderBlock(block: RichTextBlock, index: number) {
  const key = block._key || `block-${index}`;
  const content = renderSpans(block);

  switch (block.style) {
    case "h2":
      return <h2 key={key}>{content}</h2>;
    case "h3":
      return <h3 key={key}>{content}</h3>;
    case "blockquote":
      return <blockquote key={key}>{content}</blockquote>;
    default:
      return <p key={key}>{content}</p>;
  }
}

function renderList(listBlocks: RichTextBlock[], type: "bullet" | "number", key: string) {
  const ListTag = type === "number" ? "ol" : "ul";

  return (
    <ListTag key={key}>
      {listBlocks.map((block, index) => (
        <li key={block._key || `${key}-${index}`}>{renderSpans(block)}</li>
      ))}
    </ListTag>
  );
}

export function RichTextContent({ value, className }: RichTextContentProps) {
  if (!value?.length) {
    return null;
  }

  const rendered: ReactNode[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const block = value[index];

    if (block.listItem) {
      const listType = block.listItem;
      const listBlocks: RichTextBlock[] = [block];

      while (index + 1 < value.length && value[index + 1]?.listItem === listType) {
        listBlocks.push(value[index + 1]);
        index += 1;
      }

      rendered.push(renderList(listBlocks, listType, block._key || `list-${index}`));
      continue;
    }

    rendered.push(renderBlock(block, index));
  }

  return <div className={className}>{rendered}</div>;
}
