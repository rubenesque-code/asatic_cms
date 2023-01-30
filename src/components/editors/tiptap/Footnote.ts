import { mergeAttributes, Node } from "@tiptap/core";

export interface FootnoteOptions {
  number?: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    footnote: {
      addFootnote: (options: { number: number }) => ReturnType;
    };
  }
}

export const Footnote = Node.create<FootnoteOptions>({
  name: "footnote",

  inline: true,

  group: "inline",

  atom: true,

  addAttributes() {
    return {
      number: {
        default: 1,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "sup",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "sup",
      mergeAttributes(
        {
          number: HTMLAttributes.number,
          id: `footnote${HTMLAttributes.number}`,
        },
        HTMLAttributes
      ),
      String(HTMLAttributes.number),
    ];
  },

  addCommands() {
    return {
      addFootnote:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
