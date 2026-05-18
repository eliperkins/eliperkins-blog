import { visit } from "unist-util-visit";
import type { Root, InlineCode, Text, Parent } from "mdast";

export default function remarkInlineCodeLang() {
  return (tree: Root) => {
    visit(
      tree,
      "inlineCode",
      (node: InlineCode, index: number | undefined, parent: Parent | undefined) => {
        if (index === undefined || !parent) return;

        const next = parent.children[index + 1];
        if (!next || next.type !== "text") return;

        const textNode = next as Text;
        const match = textNode.value.match(/^\{(\w+)\}/);
        if (!match) return;

        const lang = match[1];

        node.data ??= {};
        node.data.hProperties = {
          ...(node.data.hProperties as Record<string, unknown> | undefined),
          className: [`language-${lang}`],
        };

        textNode.value = textNode.value.slice(match[0].length);
      }
    );
  };
}
