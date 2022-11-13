import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectSubjects, selectSubjectsByIds } from "../subjects";

import { applyFilters, mapLanguageIds, fuzzySearch } from "^helpers/general";
import { filterEntitiesByLanguage } from "./helpers";

import { Subject } from "^types/subject";

/**check subjects exist in store and translations exist for languages*/
export const selectEntitySubjectsStatus = createSelector(
  [
    selectSubjectsByIds,
    (_state: RootState, _subjectsIds: string[], docLanguagesIds: string[]) =>
      docLanguagesIds,
  ],
  (subjects, docLanguagesIds) => {
    const errors: ("missing entity" | "missing translation")[] = [];

    if (subjects.includes(undefined)) {
      errors.push("missing entity");
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

function filterSubjectsByQuery(subjects: Subject[], query: string) {
  if (!query.length) {
    return subjects;
  }

  // * query related entities?
  const queryableSubjects = subjects.map((subject) => {
    const translationNames = subject.translations.flatMap((t) =>
      t.name ? [t.name] : []
    );

    return {
      id: subject.id,
      translationNames,
    };
  });

  const entitiesMatchingQuery = fuzzySearch(
    ["translationNames"],
    queryableSubjects,
    query
  ).map((r) => {
    const entityId = r.item.id;
    const entity = subjects.find((entity) => entity.id === entityId)!;

    return entity;
  });

  return entitiesMatchingQuery;
}

export const selectSubjectsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const subjects = selectSubjects(state);

    const filtered = applyFilters(subjects, [
      (subjects) => filterEntitiesByLanguage(subjects, languageId),
      (subjects) => filterSubjectsByQuery(subjects, query),
    ]);

    return filtered;
  }
);
