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
  imageId: string;
  landing: Pick<LandingImageFields, "autoSection">;
  translations: CollectionTranslation[];
  type: "collection";
} & Expand<Pick<SecondaryContentFields, "subjectsIds">> &
  Expand<Publishable> &
  Expand<TrackSave>;

export type CollectionTranslation = Expand<TranslationGeneric> & {
  label: string;
  description?: JSONContent;
};
