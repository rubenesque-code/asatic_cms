import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectCollections, selectCollectionsByIds } from "../collections";

import { Collection } from "^types/collection";

import { applyFilters, fuzzySearch } from "^helpers/general";

import {
  filterEntitiesByLanguage,
  handleTranslatableRelatedEntityErrors,
} from "./helpers";

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

/**check status of collections related to articles, blogs, collections or recorded events */
export const selectEntityCollectionsStatus = createSelector(
  [
    selectCollectionsByIds,
    (
      _state: RootState,
      _collectionsIds: string[],
      entityLanguagesIds: string[]
    ) => entityLanguagesIds,
  ],
  (collections, entityLanguagesIds) => {
    type CollectionError = "missing entity" | "missing translation";
    type CollectionStatus =
      | "good"
      | { status: "error"; errors: CollectionError[] };

    const errors: CollectionError[] = [];

    handleTranslatableRelatedEntityErrors({
      entityLanguagesIds,
      onMissingEntity: () => errors.push("missing entity"),
      onMissingEntityTranslation: () => errors.push("missing translation"),
      relatedEntities: collections,
    });

    const status: CollectionStatus = errors.length
      ? { status: "error", errors }
      : "good";

    return status;
  }
);
