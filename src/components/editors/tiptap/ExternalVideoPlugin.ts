/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";

interface ExternalVideoOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setExternalVideo: (options: {
        src?: string;
        title?: string;
        id?: string;
      }) => ReturnType;
      updateExternalVideo: (options: {
        src?: string;
        id?: string;
      }) => ReturnType;
      // setClass: (options: { class: string }) => ReturnType;
    };
  }
}

const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export default Node.create<ExternalVideoOptions>({
  name: "external-video",

  defaultOptions: {
    inline: false,
    HTMLAttributes: {},
  },

  group: "block",

  // content: "inline",

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
      frameborder: {
        default: "0",
      },
      allow: {
        default:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      },
      allowfullscreen: {
        default: "allowfullscreen",
      },
      width: {
        default: "645",
      },
      height: {
        default: "363",
      },
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "prose-video-wrapper" },
      ["iframe", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
      ["div", { class: "prose-video-overlay" }],
    ];
  },

  addCommands() {
    return {
      setExternalVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateExternalVideo:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            ...this.options.HTMLAttributes,
            id: options.id,
            src: options.src,
          });
        },
      /*       setExternalVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        }, */
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , src, title, id] = match;

          return { src, title, id };
        },
      }),
    ];
  },
});
