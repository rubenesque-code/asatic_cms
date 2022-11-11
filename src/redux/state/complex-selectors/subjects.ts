import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectSubjects, selectSubjectsByIds } from "../subjects";

import { applyFilters, mapLanguageIds } from "^helpers/general";
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

function filterSubjectsByQuery(
  state: RootState,
  entities: Subject[],
  query: string
) {
  if (!query.length) {
    return entities;
  }

  const queryableEntities = entities.map((entity) => {
    const { id, subjectsIds, tagsIds, translations } = entity;

    const subjects = selectSubjectsByIds(state, subjectsIds).flatMap((s) =>
      s ? [s] : []
    );
    const subjectsText = subjects
      .flatMap((s) => s.translations)
      .flatMap((t) => t.text);

    const tags = selectTagsByIds(state, tagsIds).flatMap((t) => (t ? [t] : []));
    const tagsText = tags.flatMap((t) => t.text);

    const entityText = translations.map((t) => t.title);

    return {
      id,
      entityText,
      subjectsText,
      tagsText,
    };
  });

  const entitiesMatchingQuery = fuzzySearch(
    ["entityText", "subjectsText", "tagsText"],
    queryableEntities,
    query
  ).map((r) => {
    const entityId = r.item.id;
    const entity = entities.find((entity) => entity.id === entityId)!;

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
      (collections) => filterEntitiesByLanguage(collections, languageId),
      (collections) => filterCollectionsByQuery(state, collections, query),
    ]);

    return filtered;
  }
);
