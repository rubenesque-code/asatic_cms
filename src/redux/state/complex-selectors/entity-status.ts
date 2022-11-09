import { createSelector } from "@reduxjs/toolkit";

import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "^helpers/article-like";
import {
  checkHasValidRelatedPrimaryEntity,
  checkHasValidTranslation as checkCollectionHasValidTranslation,
  checkIsValidTranslation,
} from "^helpers/collection";
import {
  checkObjectWithArrayFieldsHasValue,
  mapIds,
  mapLanguageIds,
} from "^helpers/general";
import { checkRelatedSubjectIsValid } from "^helpers/subject";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "^helpers/recorded-event";

import { RootState } from "^redux/store";
import {
  Collection,
  CollectionStatus,
  CollectionRelatedEntity,
} from "^types/collection";
import { EntityWarning } from "^types/entity-status";
import { selectArticlesByIds } from "../articles";
import { selectBlogsByIds } from "../blogs";
import { selectLanguagesByIds } from "../languages";
import { selectRecordedEventsByIds } from "../recordedEvents";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";
import { checkRelatedTagIsValid } from "^helpers/tag";
import { handleRelatedEntityWarnings } from "./helpers";

export const selectCollectionStatus = createSelector(
  [(state: RootState) => state, (_state, collection: Collection) => collection],
  (state, collection): CollectionStatus => {
    if (!collection.lastSave) {
      return "new";
    }

    if (collection.publishStatus === "draft") {
      return "draft";
    }

    const hasBannerImage = collection.bannerImage.imageId;

    if (!hasBannerImage) {
      return "invalid";
    }

    const relatedLanguages = selectLanguagesByIds(
      state,
      mapLanguageIds(collection.translations)
    );
    const validRelatedLanguageIds = mapIds(
      relatedLanguages.flatMap((e) => (e ? [e] : []))
    );

    const hasValidTranslation = checkCollectionHasValidTranslation(
      collection.translations,
      validRelatedLanguageIds
    );

    if (!hasValidTranslation) {
      return "invalid";
    }

    const relatedPrimaryEntities = {
      articles: selectArticlesByIds(state, collection.articlesIds),
      blogs: selectBlogsByIds(state, collection.blogsIds),
      recordedEvents: selectRecordedEventsByIds(
        state,
        collection.recordedEventsIds
      ),
    };
    const validRelatedPrimaryEntities = {
      articles: relatedPrimaryEntities.articles.flatMap((a) => (a ? [a] : [])),
      blogs: relatedPrimaryEntities.blogs.flatMap((b) => (b ? [b] : [])),
      recordedEvents: relatedPrimaryEntities.recordedEvents.flatMap((r) =>
        r ? [r] : []
      ),
    };

    const hasValidPrimaryEntity = checkHasValidRelatedPrimaryEntity({
      articleLikeEntities: [
        ...validRelatedPrimaryEntities.articles,
        ...validRelatedPrimaryEntities.blogs,
      ],
      recordedEvents: validRelatedPrimaryEntities.recordedEvents,
      collectionLanguageIds: validRelatedLanguageIds,
    });

    if (!hasValidPrimaryEntity) {
      return "invalid";
    }

    const collectionWarnings: EntityWarning<CollectionRelatedEntity> = {
      ownTranslationsWithoutRequiredField: [],
      relatedEntitiesMissing: [],
      relatedEntitiesInvalid: [],
    };

    for (let i = 0; i < collection.translations.length; i++) {
      const translation = collection.translations[i];
      if (!checkIsValidTranslation(translation, validRelatedLanguageIds)) {
        collectionWarnings.ownTranslationsWithoutRequiredField.push({
          languageId: translation.languageId,
        });
      }
    }

    if (relatedLanguages.includes(undefined)) {
      collectionWarnings.relatedEntitiesMissing.push("language");
    }

    const relatedSubjects = selectSubjectsByIds(state, collection.subjectsIds);

    handleRelatedEntityWarnings({
      entityWarnings: collectionWarnings,
      relatedEntity: {
        type: "subject",
        entities: relatedSubjects,
        checkValidity: checkRelatedSubjectIsValid,
      },
    });

    const relatedTags = selectTagsByIds(state, collection.tagsIds);

    handleRelatedEntityWarnings({
      entityWarnings: collectionWarnings,
      relatedEntity: {
        type: "tag",
        entities: relatedTags,
        checkValidity: checkRelatedTagIsValid,
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: collectionWarnings,
      relatedEntity: {
        type: "article",
        entities: relatedPrimaryEntities.articles,
        checkValidity: (article) =>
          checkArticleLikeEntityIsValidAsSummary(
            article,
            validRelatedLanguageIds
          ),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: collectionWarnings,
      relatedEntity: {
        type: "blog",
        entities: relatedPrimaryEntities.blogs,
        checkValidity: (blog) =>
          checkArticleLikeEntityIsValidAsSummary(blog, validRelatedLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: collectionWarnings,
      relatedEntity: {
        type: "recordedEvent",
        entities: relatedPrimaryEntities.recordedEvents,
        checkValidity: (recordedEvent) =>
          checkRecordedEventIsValidAsSummary(
            recordedEvent,
            validRelatedLanguageIds
          ),
      },
    });

    const isError = checkObjectWithArrayFieldsHasValue(collectionWarnings);

    if (isError) {
      return { status: "warning", errors: collectionWarnings };
    }

    return "good";
  }
);
