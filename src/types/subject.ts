import {
  EntityGlobalFields,
  EntityNameSubSet,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity";
import { DisplayEntityStatus } from "./entity-status";
import { TranslationField, Translations } from "./entity-translation";

export type Subject = EntityGlobalFields<"subject"> &
  PublishFields &
  SaveFields &
  Translations<SubjectTranslationFields> &
  RelatedEntityFields<SubjectRelatedEntity>;

type SubjectTranslationFields = TranslationField<"name">;

export type SubjectTranslation = Subject["translations"][number];

export type SubjectRelatedEntity = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "tag"
>;

export type SubjectStatus = DisplayEntityStatus<SubjectRelatedEntity>;

/*
const subject: Subject = {
  articlesIds: [],
  blogsIds: [],
  collectionsIds: [],
  id: "",
  recordedEventsIds: [],
  tagsIds: [],
  translations: [{ id: "", languageId: "", name: "" }],
  type: "subject",
};
*/
