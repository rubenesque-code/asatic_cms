import { ArticleLikeTranslation } from "./article-like-content";
import {
  Publishable,
  SecondaryContentFields,
  TrackSave,
  TranslationGeneric,
} from "./display-content";
import { Expand } from "./utilities";

export type Blog = {
  id: string;
  translations: ATranslation[];
  type: "blog";
} & Expand<SecondaryContentFields> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type ATranslation = Expand<TranslationGeneric> &
  Expand<ArticleLikeTranslation>;
