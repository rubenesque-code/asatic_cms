import { EntityGlobalFields, RelatedDisplayEntityFields } from "./entity";
import { TranslationField, Translations } from "./entity-translation";

export type Subject = EntityGlobalFields<"subject"> &
  Translations<SubjectTranslationFields> &
  RelatedDisplayEntityFields<
    "article" | "blog" | "collection" | "recordedEvent"
  >;

type SubjectTranslationFields = TranslationField<"name">;

export type SubjectTranslation = Subject["translations"][number];
