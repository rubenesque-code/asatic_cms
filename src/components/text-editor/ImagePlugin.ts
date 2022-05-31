/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, nodeInputRule, mergeAttributes } from "@tiptap/core";

interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setFigure: (options: {
        src?: string;
        alt?: string;
        title?: string;
        id?: string;
      }) => ReturnType;
      setCaption: (options: { caption: string }) => ReturnType;
      setPosition: (options: { class: string }) => ReturnType;
    };
  }
}

const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

const Image = Node.create<ImageOptions>({
  name: "figure",

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  // inline: false,

  group: "block",

  // * adding the below line prevents being able to select the image as desired
  // content: "inline*",

  draggable: true,

  // isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      id: {
        default: null,
      },
      caption: {
        default: null,
      },
      class: {
        default: "prose-img-50",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        // contentElement: "figcaption",
        // tag: "figure",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      // "img",
      // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      "figure",
      this.options.HTMLAttributes,
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false,
        }),
      ],
      ["figcaption", HTMLAttributes?.caption || "Optional caption here."],
      // ["figcaption", 0],
    ];
  },

  addCommands() {
    return {
      setFigure:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      setCaption:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            ...this.options.HTMLAttributes,
            caption: options.caption,
          });
        },
      setPosition:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            ...this.options.HTMLAttributes,
            class: options.class,
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title, id, caption] = match;

          return { src, alt, title, id, caption };
        },
      }),
    ];
  },
});

export default Image;
