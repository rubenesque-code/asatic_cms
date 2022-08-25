import { JSONContent } from "@tiptap/core";
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
  type: "article";
} & Expand<SecondaryContentFields> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type ATranslation = Expand<TranslationGeneric> &
  Expand<ArticleLikeTranslation> & {
    landing: {
      autoSection?: JSONContent;
    };
    collection?: JSONContent;
  };
