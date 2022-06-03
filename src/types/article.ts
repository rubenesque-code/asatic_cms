import { JSONContent } from "@tiptap/react";

import { ImageType } from "^types/common";
import { Document, Translation } from "^types/editable_content";
import { Expand } from "./utilities";

type Section = {
  id: string;
  order: number;
};

export type TextSection = Section & {
  type: "text";
  htmlString: string;
};

export type ImageSection = Section & {
  type: "image";
  imageContent: {
    url: string;
    caption?: string;
    type: ImageType;
  };
};

export type TranslationSection = TextSection | ImageSection;

// export type TranslationTextField = "summary" | "author" | "title";

export type ArticleTranslation = Translation & {
  body?: JSONContent;
  summary?: string;
};

export type Article = Document<ArticleTranslation> & {
  authorIds: string[];
  summaryImage?: {
    url: string;
  };
  relatedImageIds?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type expanded = Expand<Article>;
