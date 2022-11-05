import {
  EntityGlobalFields,
  MediaFields,
  PublishFields,
  RelatedDisplayEntityFields,
  RelatedSubEntityFields,
  SaveFields,
} from "./entity";
import {
  LandingCustomSectionImageField,
  SummaryImageField,
} from "./entity-image";
import { RichText, TranslationField, Translations } from "./entity-translation";

type RecordedEventTranslationFields = TranslationField<"title"> & {
  body?: RichText;
};

export type RecordedEvent = EntityGlobalFields<"recordedEvent"> &
  MediaFields<"youtubeId"> & {
    recordedEventTypeId?: string;
  } & RelatedDisplayEntityFields<"collection" | "subject"> &
  RelatedSubEntityFields<"author" | "tag"> &
  PublishFields &
  SaveFields &
  Translations<RecordedEventTranslationFields> &
  SummaryImageField<"isNotToggleable"> &
  LandingCustomSectionImageField;

export type RecordedEventTranslation = RecordedEvent["translations"][number];
