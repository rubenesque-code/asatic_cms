import { JSONContent } from "@tiptap/core";
import { ArticleLikeTranslation } from "./article-like-content";
import {
  LandingImageFields,
  Publishable,
  SecondaryContentFields,
  TrackSave,
  TranslationGeneric,
} from "./display-content";
import { Expand } from "./utilities";

export type Article = {
  id: string;
  landingImage: Expand<LandingImageFields>;
  translations: ArticleTranslation[];
  type: "article";
} & Expand<SecondaryContentFields> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type ArticleTranslation = Expand<TranslationGeneric> &
  Expand<ArticleLikeTranslation> & {
    landingCustomSummary?: JSONContent;
  };
