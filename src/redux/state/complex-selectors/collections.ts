import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectTagsByIds } from "../tags";
import { selectArticles } from "../articles";
import { selectBlogs } from "../blogs";
import { selectCollections, selectCollectionsByIds } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectRecordedEvents } from "../recordedEvents";
import { selectSubjectsByIds } from "../subjects";

import {
  Collection,
  CollectionError,
  CollectionStatus,
} from "^types/collection";
import { checkBodyHasText } from "^helpers/article-like";
import { RecordedEvent } from "^types/recordedEvent";
import { Blog } from "^types/blog";
import { Article } from "^types/article";

import {
  applyFilters,
  fuzzySearch,
  mapIds,
  mapLanguageIds,
} from "^helpers/general";

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

// type x = ReturnType<typeof selectCollectionStatus>

export const selectCollectionStatus = createSelector(
  [(state: RootState) => state, (_state, collection: Collection) => collection],
  (state, collection) => {
    let status: CollectionStatus;

    if (!collection.lastSave) {
      status = "new";
      return status;
    }

    if (collection.publishStatus === "draft") {
      status = "draft";
      return status;
    }

    const {
      articles: relatedArticles,
      blogs: relatedBlogs,
      recordedEvents: relatedRecordedEvents,
    } = selectPrimaryEntityRelatedToCollection(state, collection.id);
    const isRelatedContent =
      relatedArticles.length ||
      relatedBlogs.length ||
      relatedRecordedEvents.length;

    if (!isRelatedContent) {
      status = "invalid";
      return;
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

    handleRelatedArticleLikeErrors(relatedArticles, () =>
      collectionErrors.push("missing article fields")
    );
    handleRelatedArticleLikeErrors(relatedBlogs, () =>
      collectionErrors.push("missing blog fields")
    );
    handleRelatedRecordedEventErrors(relatedRecordedEvents, () =>
      collectionErrors.push("missing recorded event fields")
    );

    if (collectionErrors.length) {
      status = { status: "error", errors: collectionErrors };
      return status;
    }

    status = "good";
    return status;
  }
);

function handleRelatedArticleLikeErrors<TEntity extends Article | Blog>(
  entities: TEntity[],
  onError: () => void
) {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const isTranslationWithRequiredFields = entity.translations.find(
      (t) =>
        t.title &&
        (t.collectionSummary ||
          t.landingAutoSummary ||
          t.landingCustomSummary ||
          checkBodyHasText(t.body))
    );
    if (!isTranslationWithRequiredFields) {
      onError();
    }
  }
}
function handleRelatedRecordedEventErrors(
  entities: RecordedEvent[],
  onError: () => void
) {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const isTranslationWithRequiredFields = entity.translations.find(
      (t) => t.title
    );
    if (!isTranslationWithRequiredFields) {
      onError();
    }
  }
}

export const selectPrimaryEntityRelatedToCollection = createSelector(
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

/**check status of collections related to articles, blogs or recorded events */
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
