import {
  EntityGlobalFields,
  EntityNameTupleSubset,
  RelatedDisplayEntityFields,
} from "./entity";
import { Translations } from "./entity-translation";
import { TupleToUnion } from "./utilities";

export type RecordedEventTypeRelatedEntityTuple =
  EntityNameTupleSubset<"recordedEvent">;

export type RecordedEventTypeRelatedEntity =
  TupleToUnion<RecordedEventTypeRelatedEntityTuple>;

export type RecordedEventType = EntityGlobalFields<"recordedEventType"> &
  RelatedDisplayEntityFields<RecordedEventTypeRelatedEntity> &
  Translations<RecordedEventTypeTranslationFields>;

type RecordedEventTypeTranslationFields = {
  name?: string;
};

export type RecordedEventTypeTranslation =
  RecordedEventType["translations"][number];

/*  const r: RecordedEventType = {
  id: "",
  recordedEventsIds: [],
  translations: [
    {
      id: "",
      languageId: "",
      name: "", // ?
    },
  ],
  type: 'recordedEventType'
}; */
