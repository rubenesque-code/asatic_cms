import { mapLanguageIds } from "^helpers/general";

function useMissingTranslation<TTranslation extends { languageId: string }>({
  languagesById,
  translations,
}: {
  languagesById: string[];
  translations: TTranslation[];
}) {
  let isMissingTranslation = false;

  for (let i = 0; i < languagesById.length; i++) {
    const languageId = languagesById[i];

    for (let j = 0; j < translations.length; j++) {
      const translationLanguagesById = mapLanguageIds(translations);

      if (!translationLanguagesById.includes(languageId)) {
        isMissingTranslation = true;
      }
    }
  }

  return isMissingTranslation;
}

export default useMissingTranslation;
