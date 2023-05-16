import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectArticlesByIds } from "../../articles";
import { selectBlogsByIds } from "../../blogs";
import { selectLanguagesIds } from "../../languages";
import { selectRecordedEventsByIds } from "../../recordedEvents";
// import { selectSubjectsByIds } from "../../subjects";
import { selectTagsByIds } from "../../tags";

import { checkObjectWithArrayFieldsHasValue } from "^helpers/general";
import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "^helpers/article-like";
import { checkHasValidRelatedPrimaryEntity } from "^helpers/collection";
// import { checkRelatedSubjectIsValid } from "^helpers/subject";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "^helpers/recorded-event";
import { checkRelatedTagIsValid } from "^helpers/tag";
import { EntityWarning } from "^types/entity-status";
import { handleRelatedEntityWarnings } from "./_helpers";

import {
  Collection,
  CollectionStatus,
  CollectionRelatedEntity,
  InvalidReason,
  CollectionAsChildStatus,
  ChildCollectionMissingRequirement,
} from "^types/collection";
import { selectCollectionsByIds } from "^redux/state/collections";

export const selectCollectionStatus = createSelector(
  [(state: RootState) => state, (_state, collection: Collection) => collection],
  (state, collection): CollectionStatus => {
    if (!collection.lastSave) {
      return "new";
    }

    if (collection.publishStatus === "draft") {
      return "draft";
    }

    const invalidReasons: InvalidReason[] = [];

    const hasBannerImage = collection.bannerImage.imageId;

    if (!hasBannerImage) {
      invalidReasons.push("no banner image");
    }

    const isTitle = collection.title;

    if (!isTitle) {
      invalidReasons.push("no title");
    }

    const relatedPrimaryEntities = {
      articles: selectArticlesByIds(state, collection.articlesIds),
      blogs: selectBlogsByIds(state, collection.blogsIds),
      recordedEvents: selectRecordedEventsByIds(
        state,
        collection.recordedEventsIds
      ),
    };
    const foundRelatedPrimaryEntities = {
      articles: relatedPrimaryEntities.articles.flatMap((a) => (a ? [a] : [])),
      blogs: relatedPrimaryEntities.blogs.flatMap((b) => (b ? [b] : [])),
      recordedEvents: relatedPrimaryEntities.recordedEvents.flatMap((r) =>
        r ? [r] : []
      ),
    };

    const allLanguageIds = selectLanguagesIds(state) as string[];

    const hasValidPrimaryEntity = checkHasValidRelatedPrimaryEntity({
      articleLikeEntities: [
        ...foundRelatedPrimaryEntities.articles,
        ...foundRelatedPrimaryEntities.blogs,
      ],
      recordedEvents: foundRelatedPrimaryEntities.recordedEvents,
      allLanguageIds,
    });

    if (!hasValidPrimaryEntity) {
      invalidReasons.push("no valid related diplay entity");
    }

    if (invalidReasons.length) {
      return {
        status: "invalid",
        reasons: invalidReasons,
      };
    }

    const warnings: EntityWarning<CollectionRelatedEntity> = {
      ownTranslationsWithoutRequiredField: [],
      relatedEntitiesMissing: [],
      relatedEntitiesInvalid: [],
    };

    const relatedTags = selectTagsByIds(state, collection.tagsIds);

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "tag",
        entities: relatedTags,
        checkValidity: checkRelatedTagIsValid,
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "article",
        entities: relatedPrimaryEntities.articles,
        checkValidity: (article) =>
          checkArticleLikeEntityIsValidAsSummary(article, allLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "blog",
        entities: relatedPrimaryEntities.blogs,
        checkValidity: (blog) =>
          checkArticleLikeEntityIsValidAsSummary(blog, allLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "recordedEvent",
        entities: relatedPrimaryEntities.recordedEvents,
        checkValidity: (recordedEvent) =>
          checkRecordedEventIsValidAsSummary(recordedEvent, allLanguageIds),
      },
    });

    const isError = checkObjectWithArrayFieldsHasValue(warnings);

    if (isError) {
      return { status: "warning", warnings };
    }

    return "good";
  }
);

/**check status of collections related to articles, blogs, recorded events or subjects */
export const selectEntityCollectionsStatus = createSelector(
  [
    (state: RootState) => state,
    selectCollectionsByIds,
    (
      _state: RootState,
      _collectionsIds: string[],
      entityLanguagesIds: string[]
    ) => entityLanguagesIds,
  ],
  (state, collections, entityLanguagesIds) => {
    const statusArr = collections.map((collection) =>
      selectEntityCollectionStatus(state, collection, entityLanguagesIds)
    );

    return statusArr;
  }
);

export const selectEntityCollectionStatus = createSelector(
  [
    (state: RootState) => state,
    (_state, collection: Collection | undefined) => collection,
    (
      _state,
      _collection: Collection | undefined,
      parentEntityLanguageIds: string[]
    ) => parentEntityLanguageIds,
  ],
  (state, collection): CollectionAsChildStatus => {
    if (!collection) {
      return "undefined";
    }

    if (collection.publishStatus === "draft") {
      return "draft";
    }

    const missingRequirements: ChildCollectionMissingRequirement[] = [];

    const hasBannerImage = collection.bannerImage.imageId;

    if (!hasBannerImage) {
      missingRequirements.push("no banner image");
    }

    const hasTitle = collection.title;

    if (!hasTitle) {
      missingRequirements.push("no title");
    }

    if (missingRequirements.length) {
      return {
        status: "invalid",
        missingRequirements,
      };
    }

    return "good";
  }
);
