import { JSONContent } from "@tiptap/react";

import { Document, Translation } from "^types/editable_content";
import { ResizableImage } from "./image";
import { Video } from "./video";

export type BlogTextSection = {
  type: "text";
  content: JSONContent | null;
  index: number;
  id: string;
};

export type BlogImageSection = {
  type: "image";
  image: {
    imageId: string | null;
    caption?: string;
    style: ResizableImage;
  };
  index: number;
  id: string;
};

export type BlogVideoSection = {
  type: "video";
  video?: Video;
  index: number;
  id: string;
};

export type BlogTranslationBodySection =
  | BlogTextSection
  | BlogImageSection
  | BlogVideoSection;

export type BlogTranslation = Translation & {
  title?: string;
  body: BlogTranslationBodySection[];
  // body: JSONContent;
  landingPage: {
    autoSummary?: JSONContent;
    userSummary?: JSONContent;
  };
};

export type Blog = Document<BlogTranslation> & {
  authorIds: string[];
  collectionIds: string[];
  subjectIds: string[];
  summaryImage: {
    useImage: boolean;
    imageId?: string;
    style: ResizableImage;
  };
};

export type BlogError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";
