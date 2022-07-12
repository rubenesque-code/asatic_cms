import { JSONContent } from "@tiptap/react";

import { Document, Translation } from "^types/editable_content";
import { Image, ResizableImageProps } from "./image";
import { Expand } from "./utilities";

export type ArticleTranslation = Translation & {
  body: JSONContent;
  landingPage: {
    autoSummary?: JSONContent;
    userSummary?: JSONContent;
  };
};

export type Article = Document<ArticleTranslation> & {
  authorIds: string[];
  summaryImage?: Image;
  summaryImageStyle?: ResizableImageProps;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type expanded = Expand<Article>;
