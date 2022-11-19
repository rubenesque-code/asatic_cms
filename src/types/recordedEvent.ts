import {
  EntityGlobalFields,
  EntityNameSubSet,
  MediaFields,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity";
import {
  LandingCustomSectionImageField,
  SummaryImageField,
} from "./entity-image";
import { DisplayEntityStatus } from "./entity-status";
import { RichText, TranslationField, Translations } from "./entity-translation";

type RecordedEventTranslationFields = TranslationField<"title"> & {
  body?: RichText;
};

export type RecordedEvent = EntityGlobalFields<"recordedEvent"> &
  MediaFields<"youtubeId"> &
  RelatedEntityFields<RecordedEventRelatedEntity> &
  PublishFields &
  SaveFields &
  Translations<RecordedEventTranslationFields> &
  SummaryImageField<"isNotToggleable"> &
  LandingCustomSectionImageField;

export type RecordedEventTranslation = RecordedEvent["translations"][number];

export type RecordedEventRelatedEntity = EntityNameSubSet<
  "author" | "collection" | "recordedEventType" | "subject" | "tag"
>;

export type RecordedEventStatus =
  DisplayEntityStatus<RecordedEventRelatedEntity>;

/*
const r: RecordedEvent = {
  authorsIds: [],
  collectionsIds: [],
  id: "",
  landingCustomSectionImage: {
    aspectRatio: 16 / 9, // ?
    vertPosition: 50, // ?
  },
  lastSave: new Date(),
  publishStatus: "draft",
  subjectsIds: [],
  summaryImage: {
    imageId: "", // ?
    vertPosition: 50, // ?
  },
  tagsIds: [],
  translations: [
    {
      id: "",
      languageId: "",
      body: "", // ?
      title: "", // ?
    },
  ],
  type: "recordedEvent",
  publishDate: new Date(), // ?
  youtubeId: "", // ?
  recordedEventTypeId: "", // ?
};
*/
