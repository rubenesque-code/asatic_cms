import {
  RecordedEventType,
  RecordedEventTypeTranslation,
} from "^types/recordedEventType";

export function checkIsValidTranslation(
  translation: RecordedEventTypeTranslation
) {
  return Boolean(translation.name?.length);
}

export function checkRelatedRecordedEventTypeValidity(
  recordedEventType: RecordedEventType,
  parentLanguageIds: string[]
) {
  for (let i = 0; i < parentLanguageIds.length; i++) {
    const parentLanguageId = parentLanguageIds[i];

    const translation = recordedEventType.translations.find(
      (t) => t.languageId === parentLanguageId
    );

    if (!translation) {
      return false;
    }

    if (!checkIsValidTranslation(translation)) {
      return false;
    }

    return true;
  }

  return true;
}
