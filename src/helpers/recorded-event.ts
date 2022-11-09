import { RecordedEvent, RecordedEventTranslation } from "^types/recordedEvent";

export function checkIsTranslationWithFields({
  fields,
  languagesIds,
  translations,
}: {
  translations: RecordedEventTranslation[];
  fields: ("language" | "title")[];
  languagesIds: string[];
}) {
  const translationWithFields = translations.find((translation) => {
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      if (field === "language") {
        if (!languagesIds.includes(translation.languageId)) {
          return false;
        }
      }

      if (field === "title") {
        if (!translation.title?.length) {
          return false;
        }
      }
    }
  });

  return Boolean(translationWithFields);
}

export function checkEntityIsValidAsSummary(
  entity: RecordedEvent,
  allLanguagesIds: string[]
) {
  if (entity.publishStatus !== "published") {
    return false;
  }

  if (!entity.youtubeId) {
    return false;
  }

  const isValidTranslation = checkIsTranslationWithFields({
    translations: entity.translations,
    fields: ["language", "title"],
    languagesIds: allLanguagesIds,
  });

  if (!isValidTranslation) {
    return false;
  }

  return true;
}
