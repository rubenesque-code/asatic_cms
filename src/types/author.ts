import {
  EntityGlobalFields,
  EntityNameTupleSubset,
  RelatedDisplayEntityFields,
} from "./entity";
import { EntityAsChildStatus } from "./entity-status";
import { TranslationField, Translations } from "./entity-translation";
import { TupleToUnion } from "./utilities";

export type Author = EntityGlobalFields<"author"> &
  Translations<AuthorTranslationFields> &
  RelatedDisplayEntityFields<AuthorRelatedEntity>;

export type AuthorRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "recordedEvent"
>;

export type AuthorRelatedEntity = TupleToUnion<AuthorRelatedEntityTuple>;

type AuthorTranslationFields = TranslationField<"name">;

export type AuthorTranslation = Author["translations"][number];

export type ChildAuthorMissingRequirement = "no valid translation";

export type AuthorAsChildStatus =
  EntityAsChildStatus<ChildAuthorMissingRequirement>;

/* const author: Author = {
  articlesIds: [],
  blogsIds: [],
  id: "",
  recordedEventsIds: [],
  translations: [
    {
      id: "",
      languageId: "",
      name: "", // ?
    },
  ],
  type: "author",
}; */
