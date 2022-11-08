import {
  EntityGlobalFields,
  PublishFields,
  RelatedDisplayEntityFields,
} from "./entity";
import { TranslationField, Translations } from "./entity-translation";

export type Subject = EntityGlobalFields<"subject"> &
  PublishFields &
  Translations<SubjectTranslationFields> &
  RelatedDisplayEntityFields<
    "article" | "blog" | "collection" | "recordedEvent"
  >;

type SubjectTranslationFields = TranslationField<"name">;

export type SubjectTranslation = Subject["translations"][number];

/*
const subject: Subject = {
  articlesIds: [],
  blogsIds: [],
  collectionsIds: [],
  id: "",
  recordedEventsIds: [],
  translations: [{ id: "", languageId: "", name: "" }],
  type: "subject",
};
*/
