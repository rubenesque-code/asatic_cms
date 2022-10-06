import { createSelector } from "@reduxjs/toolkit";

import { selectTagsByIds } from "../tags";
import {
  applyFilters,
  fuzzySearch,
  mapIds,
  mapLanguageIds,
} from "^helpers/general";
import { RootState } from "^redux/store";
import {
  Collection,
  Collection as CollectionType,
  CollectionError,
  CollectionStatus,
} from "^types/collection";
import { selectArticles } from "../articles";
import { selectBlogs } from "../blogs";
import { selectCollections, selectCollectionsByIds } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectRecordedEvents } from "../recordedEvents";
import { selectSubjectsByIds } from "../subjects";
import {
  filterEntitiesByLanguage,
  handleTranslatableRelatedEntityErrors,
} from "./helpers";

export const selectCollectionsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const collections = selectCollections(state);

    const filtered = applyFilters(collections, [
      (collections) => filterEntitiesByLanguage(collections, languageId),
      (collections) => filterCollectionsByQuery(state, collections, query),
    ]);

    return filtered;
  }
);

function filterCollectionsByQuery(
  state: RootState,
  entities: Collection[],
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

export const selectCollectionStatus = createSelector(
  [
    (state: RootState) => state,
    (_state, collection: CollectionType) => collection,
  ],
  (state, collection) => {
    const { lastSave, publishStatus } = collection;

    let status: CollectionStatus;

    if (!lastSave) {
      status = "new";
      return status;
    }

    if (publishStatus === "draft") {
      status = "draft";
      return status;
    }

    const hasValidTranslation = collection.translations.find((translation) => {
      const { languageId, title } = translation;

      const languageIsValid = selectLanguageById(state, languageId);

      const hasTitle = title.length;

      if (languageIsValid && hasTitle) {
        return true;
      }
      return false;
    });

    if (!hasValidTranslation) {
      status = "invalid";
      return status;
    }

    const collectionErrors: CollectionError[] = [];

    const collectionLanguages = selectLanguagesByIds(
      state,
      mapLanguageIds(collection.translations)
    );
    if (collectionLanguages.includes(undefined)) {
      collectionErrors.push("missing language");
    }

    const collectionValidLanguagesIds = mapIds(
      collectionLanguages.flatMap((l) => (l ? [l] : []))
    );

    const collectionSubjects = selectSubjectsByIds(
      state,
      collection.subjectsIds
    );

    handleTranslatableRelatedEntityErrors({
      entityLanguagesIds: collectionValidLanguagesIds,
      onMissingEntity: () => collectionErrors.push("missing subject"),
      onMissingEntityTranslation: () =>
        collectionErrors.push("missing subject translation"),
      relatedEntities: collectionSubjects,
    });

    const tags = selectTagsByIds(state, collection.tagsIds);
    if (tags.includes(undefined)) {
      collectionErrors.push("missing tag");
    }

    if (collectionErrors.length) {
      status = { status: "error", errors: collectionErrors };
      return status;
    }

    status = "good";
    return status;
  }
);

export const selectPrimaryContentRelatedToCollection = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, collectionId: string) => collectionId,
  ],
  (state, collectionId) => {
    const articles = selectArticles(state);
    const relatedArticles = articles.filter((article) =>
      article.collectionsIds.includes(collectionId)
    );

    const blogs = selectBlogs(state);
    const relatedBlogs = blogs.filter((blog) =>
      blog.collectionsIds.includes(collectionId)
    );

    const recordedEvents = selectRecordedEvents(state);
    const relatedRecordedEvents = recordedEvents.filter((recordedEvent) =>
      recordedEvent.collectionsIds.includes(collectionId)
    );

    return {
      articles: relatedArticles,
      blogs: relatedBlogs,
      recordedEvents: relatedRecordedEvents,
    };
  }
);

export const selectDocCollectionsStatus = createSelector(
  [
    selectCollectionsByIds,
    (_state: RootState, _collectionsIds: string[], docLanguagesIds: string[]) =>
      docLanguagesIds,
  ],
  (collections, docLanguagesIds) => {
    const errors: ("missing collection" | "missing translation")[] = [];

    if (collections.includes(undefined)) {
      errors.push("missing collection");
    }

    const validCollections = collections.flatMap((s) => (s ? [s] : []));
    let isMissingTranslation = false;

    for (let i = 0; i < docLanguagesIds.length; i++) {
      if (isMissingTranslation) {
        break;
      }
      const languageId = docLanguagesIds[i];

      for (let j = 0; j < validCollections.length; j++) {
        const { translations } = validCollections[j];
        const collectionLanguagesIds = mapLanguageIds(translations);

        if (!collectionLanguagesIds.includes(languageId)) {
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
