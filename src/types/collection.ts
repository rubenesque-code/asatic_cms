import { JSONContent } from "@tiptap/core";
import { TranslationPayloadGeneric } from "^redux/state/types";

import {
  SecondaryContentFields,
  DisplayEntity,
  DisplayEntityType,
  DisplayEntityStatus,
} from "./display-entity";
import { Expand } from "./utilities";

export type Collection = {
  id: string;
  bannerImage: {
    imageId?: string;
    vertPosition: number;
  };
  translations: CollectionTranslation[];
} & DisplayEntity &
  DisplayEntityType<"collection"> &
  Pick<SecondaryContentFields, "subjectsIds" | "tagsIds">;

export type CollectionTranslation = Expand<TranslationPayloadGeneric> & {
  title: string;
  description?: JSONContent;
};

export type CollectionStatus = DisplayEntityStatus<CollectionError>;

export type CollectionError =
  | "missing language"
  | "missing subject"
  | "missing subject translation"
  | "missing tag"
  | "missing article fields"
  | "missing blog fields"
  | "missing recorded event fields";
