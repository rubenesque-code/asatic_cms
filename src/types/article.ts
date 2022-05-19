import { ImageType } from "^types/common";
import { AuthorId, Document, Translation } from "^types/editable_content";
import { Expand, ExpandRecursively } from "./utilities";

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
  body?: string;
  summary?: string;
};

export type Article = Document<ArticleTranslation> & {
  authorId?: AuthorId;
  summaryImage?: {
    url: string;
  };
  relatedImageIds?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type expanded = Expand<Article>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type expandedRecursive = ExpandRecursively<Article>;
