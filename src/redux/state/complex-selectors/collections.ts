import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectCollections, selectCollectionsByIds } from "../collections";

import { Collection } from "^types/collection";

import { applyFilters, fuzzySearch } from "^helpers/general";
import { allLanguageId } from "^components/FilterLanguageSelect";

export const selectCollectionsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: { languageId: string; query: string; excludedIds?: string[] }
    ) => filters,
  ],
  (state, { languageId, query, excludedIds }) => {
    const collections = selectCollections(state);

    const filtered = applyFilters(collections, [
      (collections) =>
        collections.filter(
          (collection) => !excludedIds?.includes(collection.id)
        ),
      (collections) =>
        languageId === allLanguageId
          ? collections
          : collections.filter(
              (collection) => collection.languageId === languageId
            ),
      (collections) => filterCollectionsByQuery(collections, query),
    ]);

    return filtered;
  }
);

function filterCollectionsByQuery(collections: Collection[], query: string) {
  if (!query.length) {
    return collections;
  }

  const queryableCollections = collections.map((entity) => {
    const { id, title } = entity;

    return {
      id,
      title,
    };
  });

  const entitiesMatchingQuery = fuzzySearch(
    ["title"],
    queryableCollections,
    query
  ).map((r) => {
    const entityId = r.item.id;
    const entity = collections.find((entity) => entity.id === entityId)!;

    return entity;
  });

  return entitiesMatchingQuery;
}

export const selectCollectionsByIdsAndLanguageId = createSelector(
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
    const collections = selectCollectionsByIds(state, ids);

    const found = collections.flatMap((collection) =>
      collection ? [collection] : []
    );
    const numMissing = collections.length - found.length;

    const valid = found.filter(
      (collection) => collection.languageId === parentLanguageId
    );

    const invalid = found.filter(
      (collection) => collection.languageId !== parentLanguageId
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
