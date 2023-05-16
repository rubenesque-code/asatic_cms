import {
  EntityGlobalFields,
  EntityNameTupleSubset,
  MediaFields,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity";
import { SummaryImageField } from "./entity-image";
import { DisplayEntityStatus } from "./entity-status";
import { RichText, TranslationField, Translations } from "./entity-translation";
import { TupleToUnion } from "./utilities";

type RecordedEventTranslationFields = TranslationField<"title"> & {
  body?: RichText;
};

export type RecordedEvent = EntityGlobalFields<"recordedEvent"> &
  MediaFields<"youtubeId"> &
  RelatedEntityFields<RecordedEventRelatedEntity> &
  PublishFields &
  SaveFields &
  Translations<RecordedEventTranslationFields> &
  SummaryImageField<"isNotToggleable">;

export type RecordedEventTranslation = RecordedEvent["translations"][number];

export type RecordedEventRelatedEntityTuple = EntityNameTupleSubset<
  "author" | "collection" | "recordedEventType" | "subject" | "tag"
>;
export type RecordedEventRelatedEntity =
  TupleToUnion<RecordedEventRelatedEntityTuple>;

export type MissingRecordedEventRequirement =
  | "no video"
  | "no valid translation"
  | "no video type";

export type RecordedEventStatus = DisplayEntityStatus<
  RecordedEventRelatedEntity,
  MissingRecordedEventRequirement
>;

/* const r: RecordedEvent = {
  summaryImage: {
    imageId: null,
    vertPosition: 50
  }
} */
