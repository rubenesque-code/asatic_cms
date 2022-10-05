import { JSONContent } from "@tiptap/core";

import {
  TranslationGeneric,
  SecondaryContentFields,
  DisplayEntity,
  DisplayEntityType,
} from "./display-entity";
import { Expand } from "./utilities";

export type Collection = {
  id: string;
  bannerImage: {
    imageId: string;
    vertPosition: number;
  };
  translations: CollectionTranslation[];
} & DisplayEntity &
  DisplayEntityType<"collection"> &
  Pick<SecondaryContentFields, "subjectsIds" | "tagsIds">;

export type CollectionTranslation = Expand<TranslationGeneric> & {
  title: string;
  description?: JSONContent;
};
