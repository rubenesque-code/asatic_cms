import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";

import { applyFilters, fuzzySearch } from "^helpers/general";
import { filterEntitiesByLanguage } from "./helpers";

import { selectRecordedEventTypes } from "../recordedEventsTypes";
import { RecordedEventType } from "^types/recordedEventType";

export const selectRecordedEventTypeByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const recordedEventTypes = selectRecordedEventTypes(state);

    const filtered = applyFilters(recordedEventTypes, [
      (recordedEventTypes) =>
        filterEntitiesByLanguage(recordedEventTypes, languageId),
      (recordedEventTypes) => filterByQuery(recordedEventTypes, query),
    ]);

    return filtered;
  }
);

function filterByQuery(recordedEventTypes: RecordedEventType[], query: string) {
  if (!query.length) {
    return recordedEventTypes;
  }

  const queryable = recordedEventTypes.map((subject) => {
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
    queryable,
    query
  ).map((r) => {
    const entityId = r.item.id;
    const entity = recordedEventTypes.find((entity) => entity.id === entityId)!;

    return entity;
  });

  return entitiesMatchingQuery;
}
