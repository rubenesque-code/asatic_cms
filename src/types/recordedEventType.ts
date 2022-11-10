import { EntityGlobalFields } from "./entity";
import { Translations } from "./entity-translation";

export type RecordedEventType = EntityGlobalFields<"recordedEventType"> &
  Translations<RecordedEventTypeTranslationFields>;

type RecordedEventTypeTranslationFields = {
  name?: string;
};

export type RecordedEventTypeTranslation =
  RecordedEventType["translations"][number];
