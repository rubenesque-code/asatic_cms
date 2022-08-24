import { JSONContent } from "@tiptap/core";
import {
  LandingImageFields,
  TranslationGeneric,
  TrackSave,
  Publishable,
  SecondaryContentFields,
} from "./display-content";
import { Expand } from "./utilities";

export type Collection = {
  id: string;
  image: {
    id?: string;
    vertPosition: number;
  };
  landing: Pick<LandingImageFields, "autoSection">;
  translations: CollectionTranslation[];
  type: "collection";
} & Expand<Pick<SecondaryContentFields, "subjectsIds" | "tagsIds">> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type CollectionTranslation = Expand<TranslationGeneric> & {
  title: string;
  description?: JSONContent;
};
