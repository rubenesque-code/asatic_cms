import { JSONContent } from "@tiptap/react";

import {
  PrimaryContent,
  PrimaryContentType,
  Translation,
  PrimaryContentStatus,
} from "^types/primary-content";
import { ResizableImage } from "./image";
import { Video } from "./video";

export type ArticleLikeContentTextSection = {
  type: "text";
  content: JSONContent | null;
  index: number;
  id: string;
};

export type ArticleLikeContentImageSection = {
  type: "image";
  image: {
    imageId: string | null;
    caption?: string;
    style: ResizableImage;
  };
  index: number;
  id: string;
};

export type ArticleLikeContentVideoSection = {
  type: "video";
  video?: Video;
  index: number;
  id: string;
};

export type ArticleLikeContentTranslationBodySection =
  | ArticleLikeContentTextSection
  | ArticleLikeContentImageSection
  | ArticleLikeContentVideoSection;

export type ArticleLikeContentTranslation = Translation & {
  body: ArticleLikeContentTranslationBodySection[];
  landingPage: {
    autoSummary?: JSONContent;
    userSummary?: JSONContent;
  };
};

export type ArticleLikeContent<
  TType extends Extract<PrimaryContentType, "article" | "blog">
> = PrimaryContent<ArticleLikeContentTranslation, TType>;

export type ArticleLikeContentError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";

export type ArticleLikeContentStatus =
  PrimaryContentStatus<ArticleLikeContentError>;
