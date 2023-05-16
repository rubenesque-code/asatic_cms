import { createSelector } from "@reduxjs/toolkit";

import { applyFilters, mapLanguageIds } from "^helpers/general";

import { RootState } from "^redux/store";
import {
  selectRecordedEvents,
  selectRecordedEventsByIds,
} from "../recordedEvents";

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

export const selectRecordedEventsByIdsAndLanguageId = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: {
        ids: string[];
        parentLanguageId: string;
      }
    ) => filters,
  ],
  (state, { parentLanguageId, ids }) => {
    const recordedEvents = selectRecordedEventsByIds(state, ids);

    const found = recordedEvents.flatMap((recordedEvent) =>
      recordedEvent ? [recordedEvent] : []
    );
    const numMissing = recordedEvents.length - found.length;

    const valid = found.filter((recordedEvent) =>
      mapLanguageIds(recordedEvent.translations).includes(parentLanguageId)
    );
    const invalid = found.filter(
      (recordedEvent) =>
        !mapLanguageIds(recordedEvent.translations).includes(parentLanguageId)
    );

    return {
      numMissing,
      valid,
      invalid: {
        entities: invalid,
        reason: "no translation for parent language",
      },
    };
  }
);
