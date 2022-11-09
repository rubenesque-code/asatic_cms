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

export const checkTranslationMeetsRequirements = (
  translation: RecordedEventTranslation,
  requirements: ["valid language", "title"],
  languageIds: string[]
) => {
  for (let j = 0; j < requirements.length; j++) {
    const requirement = requirements[j];
    if (requirement === "valid language") {
      if (!languageIds.includes(translation.languageId)) {
        return false;
      }
    }
    if (requirement === "title") {
      if (!translation.title?.length) {
        return false;
      }
    }
  }

  return true;
};

export const checkIsValidTranslation = (
  translation: RecordedEventTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId);
  const isTitle = translation.title?.length;

  return Boolean(languageIsValid && isTitle);
};

export const checkHasValidTranslation = (
  translations: RecordedEvent["translations"],
  validLanguageIds: string[]
) => {
  const validTranslation = translations.find((translation) => {
    checkIsValidTranslation(translation, validLanguageIds);
  });

  return Boolean(validTranslation);
};
