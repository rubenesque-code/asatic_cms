/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";

interface ExternalVideoOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
  width: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setExternalVideo: (options: {
        src?: string;
        // title?: string;
        id?: string;
      }) => ReturnType;
      updateExternalVideo: (options: {
        src?: string;
        id?: string;
      }) => ReturnType;
      setVideoCaption: (options: { caption: string }) => ReturnType;
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
    width: 645,
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
      /*       allow: {
        default:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        // "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      }, */
      /*       allowfullscreen: {
        default: "allowfullscreen",
      }, */
      width: {
        default: this.options.width,
      },
      height: {
        default: (this.options.width * 9) / 16,
      },
      id: {
        default: null,
      },
      caption: {
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
      /*       [
        "iframe",
        mergeAttributes(this.options.HTMLAttributes, {
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        }),
      ], */
      [
        "iframe",
        mergeAttributes(this.options.HTMLAttributes, {
          ...HTMLAttributes,
          allow:
            "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          // modestbranding: 1,
          // autoplay: 0,
          allowfullscreen: "allowfullscreen",
          frameborder: 0,
          // color: "red",
          // controls: 0,
          // showinfo: 0,
        }),
      ],
      [
        "figcaption",
        HTMLAttributes?.caption ||
          "Optional caption here. (change from video menu)",
      ],
      ["div", { class: "prose-video-overlay" }],
    ];
  },

  addCommands() {
    return {
      setExternalVideo:
        ({ id, src }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              id,
              src: src + "?rel=0&showinfo=0&autoplay=0&loop=0&modestbranding",
            },
          });
        },
      updateExternalVideo:
        ({ id, src }) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            id,
            src: src + "?rel=0&showinfo=0&autoplay=0&loop=0&modestbranding",
          });
        },
      // * there are 2 se
      setVideoCaption:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            caption: options.caption,
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
          const [, , src, title, id, caption] = match;

          return { src, title, id, caption };
        },
      }),
    ];
  },
});
