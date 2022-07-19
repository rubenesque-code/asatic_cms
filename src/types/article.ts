import { JSONContent } from "@tiptap/react";

import { Document, Translation } from "^types/editable_content";
import { ResizableImage } from "./image";
import { Expand } from "./utilities";

export type ArticleTranslation = Translation & {
  body: (
    | { type: "text"; content: JSONContent }
    | { type: "image"; imgId: string }
  )[];
  landingPage: {
    autoSummary?: JSONContent;
    userSummary?: JSONContent;
  };
};

export type Article = Document<ArticleTranslation> & {
  authorIds: string[];
  summaryImage: {
    useImage: boolean;
    imageId?: string;
    style: ResizableImage;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type expanded = Expand<Article>;
