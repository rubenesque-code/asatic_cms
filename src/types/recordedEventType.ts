import { Translations } from "./entity-translation";

export type RecordedEventType = {
  id: string;
} & Translations<RecordedEventTypeTranslation>;

export type RecordedEventTypeTranslation = {
  name?: string;
};
