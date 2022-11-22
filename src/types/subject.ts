import {
  EntityGlobalFields,
  EntityNameSubSet,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity";
import { DisplayEntityStatus, EntityAsChildStatus } from "./entity-status";
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
export type SubjectDisplayEntity = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent"
>;

export type InvalidReason =
  | "no valid translation"
  | "no valid related diplay entity";

export type SubjectStatus = DisplayEntityStatus<
  SubjectRelatedEntity,
  InvalidReason
>;

export type SubjectAsChildStatus = EntityAsChildStatus<"no valid translation">;

/* const subject: Subject = {
  articlesIds: [],
  blogsIds: [],
  collectionsIds: [],
  id: "",
  lastSave: null,
  publishDate: new Date(), // ?
  publishStatus: "draft",
  recordedEventsIds: [],
  tagsIds: [],
  translations: [
    {
      id: "",
      languageId: "",
      name: "", // ?
    },
  ],
  type: "subject",
};
 */
