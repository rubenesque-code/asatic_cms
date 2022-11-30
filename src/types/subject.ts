import {
  EntityGlobalFields,
  EntityNameSubSet,
  EntityNameTupleSubset,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity";
import { DisplayEntityStatus, EntityAsChildStatus } from "./entity-status";
import { TranslationField, Translations } from "./entity-translation";
import { TupleToUnion } from "./utilities";

export type Subject = EntityGlobalFields<"subject"> &
  PublishFields &
  SaveFields &
  Translations<SubjectTranslationFields> &
  RelatedEntityFields<SubjectRelatedEntity>;

type SubjectTranslationFields = TranslationField<"title">;

export type SubjectTranslation = Subject["translations"][number];

export type SubjectRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "collection" | "recordedEvent" | "tag"
>;

export type SubjectRelatedEntity = TupleToUnion<SubjectRelatedEntityTuple>;

export type SubjectDisplayEntity = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent"
>;

export type MissingRequirement =
  | "no valid translation"
  | "no valid related diplay entity";

export type SubjectStatus = DisplayEntityStatus<
  SubjectRelatedEntity,
  MissingRequirement
>;

export type ChildSubjectMissingRequirement = "no valid translation";

export type SubjectAsChildStatus =
  EntityAsChildStatus<ChildSubjectMissingRequirement>;

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
