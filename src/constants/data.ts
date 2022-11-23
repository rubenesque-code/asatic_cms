import { EntityName } from "^types/entity";

export const siteLanguageIds = {
  english: "english",
  tamil: "tamil",
} as const;
export const siteLanguageIdsArr = Object.values(siteLanguageIds);

export const default_language_Id = siteLanguageIds.english;
export const second_default_language_Id = siteLanguageIds.tamil;

export const entityNameToLabel = (
  entityName: EntityName | "landing" | "language"
) =>
  entityName === "recordedEvent"
    ? "video document"
    : entityName === "recordedEventType"
    ? "video document type"
    : entityName;
