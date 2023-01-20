import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import {
  selectCollectionById,
  selectCollections,
  selectCollectionsByIds,
} from "../collections";

import { Collection } from "^types/collection";

import { applyFilters, fuzzySearch, mapLanguageIds } from "^helpers/general";

import { filterEntitiesByLanguage } from "./helpers";

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
      (collections) => filterEntitiesByLanguage(collections, languageId),
      (collections) => filterCollectionsByQuery(state, collections, query),
    ]);

    return filtered;
  }
);

function filterCollectionsByQuery(
  state: RootState,
  collections: Collection[],
  query: string
) {
  if (!query.length) {
    return collections;
  }

  const queryableCollections = collections.map((entity) => {
    const { id, translations } = entity;

    const translationTitles = translations.map((t) => t.title);
    const translationDescriptions = translations.map((t) => t.description);

    return {
      id,
      translationTitles,
      translationDescriptions,
    };
  });

  const entitiesMatchingQuery = fuzzySearch(
    ["translationTitles", "translationDescriptions"],
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
    console.log("valid:", valid);
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
