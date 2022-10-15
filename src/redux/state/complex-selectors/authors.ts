import { createSelector } from "@reduxjs/toolkit";
import { mapLanguageIds } from "^helpers/general";
import { RootState } from "^redux/store";

import { selectAuthorsByIds } from "../authors";

/**check authors exist in store and translations exist for languages*/
export const selectDocAuthorsStatus = createSelector(
  [
    selectAuthorsByIds,
    (_state: RootState, _authorsIds: string[], docLanguagesIds: string[]) =>
      docLanguagesIds,
  ],
  (authors, docLanguagesIds) => {
    const errors: ("missing entity" | "missing translation")[] = [];

    if (authors.includes(undefined)) {
      errors.push("missing entity");
    }

    const validAuthors = authors.flatMap((s) => (s ? [s] : []));
    let isMissingTranslation = false;

    for (let i = 0; i < docLanguagesIds.length; i++) {
      if (isMissingTranslation) {
        break;
      }
      const languageId = docLanguagesIds[i];

      for (let j = 0; j < validAuthors.length; j++) {
        const { translations } = validAuthors[j];
        const authorLanguagesIds = mapLanguageIds(translations);

        if (!authorLanguagesIds.includes(languageId)) {
          isMissingTranslation = true;
          break;
        }
      }
    }

    if (isMissingTranslation) {
      errors.push("missing translation");
    }

    return errors.length ? errors : "good";
  }
);
