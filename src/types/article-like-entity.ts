import { TranslationGeneric } from "./translation";

import { ResizableImage } from "./image";
import { Expand } from "./utilities";

export type ArticleLikeTextSection = {
  type: "text";
  text?: string;
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
  video: {
    youtubeId?: string;
    caption?: string;
  };
  index: number;
  id: string;
};

export type ArticleLikeTranslation = {
  title?: string;
  body: (
    | Expand<ArticleLikeTextSection>
    | Expand<ArticleLikeImageSection>
    | Expand<ArticleLikeVideoSection>
  )[];
  collectionSummary?: string;
  landingAutoSummary?: string;
  landingCustomSummary?: string;
} & TranslationGeneric;
