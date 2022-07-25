import { JSONContent } from "@tiptap/react";

import { Document, Translation } from "^types/editable_content";
import { ResizableImage } from "./image";
import { Expand } from "./utilities";
import { Video } from "./video";

export type ArticleTranslationBodyTextSection = {
  type: "text";
  content: JSONContent | null;
  index: number;
  id: string;
};

export type ArticleTranslationBodyImageSection = {
  type: "image";
  image: {
    imageId: string | null;
    caption?: string;
    style: ResizableImage;
  };
  index: number;
  id: string;
};

export type ArticleTranslationBodyVideoSection = {
  type: "video";
  video: Video;
  index: number;
  id: string;
};

export type ArticleTranslationBodySection =
  | ArticleTranslationBodyTextSection
  | ArticleTranslationBodyImageSection
  | ArticleTranslationBodyVideoSection;

export type ArticleTranslation = Translation & {
  title?: string;
  body: ArticleTranslationBodySection[];
  // body: JSONContent;
  landingPage: {
    autoSummary?: JSONContent;
    userSummary?: JSONContent;
  };
};

export type Article = Document<ArticleTranslation> & {
  authorIds: string[];
  subjectIds: string[];
  summaryImage: {
    useImage: boolean;
    imageId?: string;
    style: ResizableImage;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type expanded = Expand<Article>;
