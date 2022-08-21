import { JSONContent } from "@tiptap/react";

import { ContentStatus } from "^types/primary-content";
import { ResizableImage } from "./image";
import { Expand } from "./utilities";
import { Video } from "./video";

export type ArticleLikeTextSection = {
  type: "text";
  content?: JSONContent;
  index: number;
  id: string;
};

export type ArticleLikeImageSection = {
  type: "image";
  image: {
    imageId?: string;
    caption?: string;
    style: ResizableImage;
  };
  index: number;
  id: string;
};

export type ArticleLikeVideoSection = {
  type: "video";
  video?: Video;
  index: number;
  id: string;
};

export type ArticleLikeContentError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";

export type ArticleLikeContentStatus = ContentStatus<ArticleLikeContentError>;

////

export type ArticleLikeTranslation = {
  title?: string;
  body?: (
    | Expand<ArticleLikeTextSection>
    | Expand<ArticleLikeImageSection>
    | Expand<ArticleLikeVideoSection>
  )[];
};
