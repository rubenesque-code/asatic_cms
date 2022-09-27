import { createSelector } from "@reduxjs/toolkit";
import { mapLanguageIds } from "^helpers/general";
import { RootState } from "^redux/store";
import { selectSubjectsByIds } from "../subjects";

/**check subjects exist in store and translations exist for languages*/
export const selectDocSubjectsStatus = createSelector(
  [
    selectSubjectsByIds,
    (_state: RootState, _subjectsIds: string[], docLanguagesIds: string[]) =>
      docLanguagesIds,
  ],
  (subjects, docLanguagesIds) => {
    const errors: ("missing subject" | "missing translation")[] = [];

    if (subjects.includes(undefined)) {
      errors.push("missing subject");
    }

    const validSubjects = subjects.flatMap((s) => (s ? [s] : []));
    let isMissingTranslation = false;

    for (let i = 0; i < docLanguagesIds.length; i++) {
      if (isMissingTranslation) {
        break;
      }
      const languageId = docLanguagesIds[i];

      for (let j = 0; j < validSubjects.length; j++) {
        const { translations } = validSubjects[j];
        const subjectLanguagesIds = mapLanguageIds(translations);

        if (!subjectLanguagesIds.includes(languageId)) {
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