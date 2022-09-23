import { JSONContent } from "@tiptap/core";
import { ArticleLikeTranslation } from "./article-like-content";
import {
  LandingImageFields,
  Publishable,
  SecondaryContentFields,
  TrackSave,
  TranslationGeneric,
} from "./display-content";
import { Expand, MyOmit } from "./utilities";

export type Blog = {
  id: string;
  landingImage: Expand<MyOmit<LandingImageFields, "autoSection">>;
  translations: BlogTranslation[];
  type: "blog";
} & Expand<SecondaryContentFields> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type BlogTranslation = Expand<TranslationGeneric> &
  Expand<ArticleLikeTranslation> & {
    landingCustomSummary?: JSONContent;
  };
