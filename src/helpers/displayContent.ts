import produce from "immer";

import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";

import { Publishable, TrackSave } from "^types/display-entity";

export function orderDisplayContent<TEntity extends Publishable & TrackSave>(
  entities: TEntity[]
) {
  return produce(entities, (draft) => {
    draft.sort((a, b) => {
      const aIsNew = !a.lastSave;
      const bIsNew = !b.lastSave;
      if (aIsNew && bIsNew) {
        return 0;
      } else if (aIsNew) {
        return -1;
      } else if (bIsNew) {
        return 1;
      }
      if (a.publishStatus === "published" && b.publishStatus === "published") {
        return b.publishDate!.getTime() - a.publishDate!.getTime();
      } else if (a.publishStatus === "published") {
        return -1;
      } else if (b.publishStatus === "published") {
        return 1;
      }

      return 0;
    });
  });
}

export function selectTranslationForActiveLanguage<
  TTranslation extends { languageId: string }
>(translations: TTranslation[], activeLanguageId: string) {
  const translationForActiveLanguage = translations.find(
    (t) => t.languageId === activeLanguageId
  );
  const translationForDefault = translations.find(
    (t) => t.languageId === default_language_Id
  );
  const translationForSecondDefault = translations.find(
    (t) => t.languageId === second_default_language_Id
  );

  const translationToUse = translationForActiveLanguage
    ? translationForActiveLanguage
    : translationForDefault
    ? translationForDefault
    : translationForSecondDefault
    ? translationForSecondDefault
    : translations[0];

  return translationToUse;
}
