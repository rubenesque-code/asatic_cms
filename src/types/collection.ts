import { JSONContent } from "@tiptap/core";
import {
  LandingFields,
  TranslationGeneric,
  TrackSave,
  Publishable,
  SecondaryContentFields,
} from "./display-content";
import { Expand } from "./utilities";

export type Collection = {
  id: string;
  imageId: string;
  landing: Pick<LandingFields, "autoSection">;
  translations: CollectionTranslation[];
  // translations: Expand<CollectionTranslation[]>;
} & Expand<Pick<SecondaryContentFields, "subjectsIds">> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type CollectionTranslation = Expand<TranslationGeneric> & {
  label: string;
  description?: JSONContent;
};
