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
  SummaryImageFields,
} from "./entity-image";
import { Translations } from "./entity-translation";

type RecordedEventTranslationFields = {
  title?: string;
  body?: string;
};

export type RecordedEvent = EntityGlobalFields<"recordedEvent"> &
  MediaFields<"youtubeId"> & {
    recordedEventTypeId?: string;
  } & RelatedDisplayEntityFields<"collection" | "subject"> &
  RelatedSubEntityFields<"author" | "tag"> &
  PublishFields &
  SaveFields &
  Translations<RecordedEventTranslationFields> &
  SummaryImageFields<"isNotToggleable"> &
  LandingCustomSectionImageField;

export type RecordedEventTranslation = RecordedEvent["translations"][number];
