import { EntityGlobalFields, RelatedDisplayEntityFields } from "./entity";
import { Translations } from "./entity-translation";

export type Subject = EntityGlobalFields<"subject"> &
  Translations<SubjectTranslationFields> &
  RelatedDisplayEntityFields<
    "article" | "blog" | "collection" | "recordedEvent"
  >;

type SubjectTranslationFields = {
  text: string;
};

export type SubjectTranslation = Subject["translations"][number];
