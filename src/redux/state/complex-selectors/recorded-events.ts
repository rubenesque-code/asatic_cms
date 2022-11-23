import { createSelector } from "@reduxjs/toolkit";

import { applyFilters } from "^helpers/general";

import { RootState } from "^redux/store";
import { selectRecordedEvents } from "../recordedEvents";

import {
  filterEntitiesByLanguage,
  filterPrimaryEntitiesByQuery,
} from "./helpers";

export const selectRecordedEventsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: { languageId: string; query: string; excludedIds?: string[] }
    ) => filters,
  ],
  (state, { languageId, query, excludedIds }) => {
    const recordedEvents = selectRecordedEvents(state);

    const filtered = applyFilters(recordedEvents, [
      (recordedEvents) =>
        recordedEvents.filter(
          (recordedEvent) => !excludedIds?.includes(recordedEvent.id)
        ),
      (recordedEvents) => filterEntitiesByLanguage(recordedEvents, languageId),
      (recordedEvents) =>
        filterPrimaryEntitiesByQuery(state, recordedEvents, query),
    ]);

    return filtered;
  }
);
