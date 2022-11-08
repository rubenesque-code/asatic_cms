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
import { EntityError } from "^types/entity-status";
import { selectArticlesByIds } from "../articles";
import { selectBlogsByIds } from "../blogs";
import { selectLanguagesByIds } from "../languages";
import { selectRecordedEventsByIds } from "../recordedEvents";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";
import { checkRelatedTagIsValid } from "^helpers/tag";
import { handleRelatedEntityErrors } from "./helpers";

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
    const validLanguageIds = mapIds(
      relatedLanguages.flatMap((e) => (e ? [e] : []))
    );

    const hasValidTranslation = checkCollectionHasValidTranslation(
      collection.translations,
      validLanguageIds
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
      collectionLanguageIds: validLanguageIds,
    });

    if (!hasValidPrimaryEntity) {
      return "invalid";
    }

    const collectionErrors: EntityError<CollectionRelatedEntity> = {
      ownTranslationsWithoutRequiredField: [],
      relatedEntitiesMissing: [],
      relatedEntitiesInvalid: [],
    };

    for (let i = 0; i < collection.translations.length; i++) {
      const translation = collection.translations[i];
      if (!checkIsValidTranslation(translation, validLanguageIds)) {
        collectionErrors.ownTranslationsWithoutRequiredField.push({
          languageId: translation.languageId,
        });
      }
    }

    if (relatedLanguages.includes(undefined)) {
      collectionErrors.relatedEntitiesMissing.push("language");
    }

    const relatedSubjects = selectSubjectsByIds(state, collection.subjectsIds);

    for (let i = 0; i < relatedSubjects.length; i++) {
      const subject = relatedSubjects[i];
      if (!subject) {
        collectionErrors.relatedEntitiesMissing.push("subject");
        break;
      }
      if (!checkRelatedSubjectIsValid(subject)) {
        collectionErrors.relatedEntitiesInvalid.push("subject");
      }
    }

    const relatedTags = selectTagsByIds(state, collection.tagsIds);

    handleRelatedEntityErrors({
      entities: relatedTags,
      invalid: {
        check: checkRelatedTagIsValid,
        update: () => collectionErrors.relatedEntitiesInvalid.push("tag"),
      },
      onMissing: () => collectionErrors.relatedEntitiesMissing.push("tag"),
    });

    // todo
    handleRelatedEntityErrors({
      entities: relatedPrimaryEntities.articles,
      invalid: {
        check: checkRelatedTagIsValid,
        update: () => collectionErrors.relatedEntitiesInvalid.push("tag"),
      },
      onMissing: () => collectionErrors.relatedEntitiesMissing.push("tag"),
    });

    for (let i = 0; i < relatedPrimaryEntities.articles.length; i++) {
      const article = relatedPrimaryEntities.articles[i];
      if (!article) {
        collectionErrors.relatedEntitiesMissing.push("article");
        break;
      }

      if (!checkArticleLikeEntityIsValidAsSummary(article, validLanguageIds)) {
        collectionErrors.relatedEntitiesInvalid.push("article");
      }
    }

    for (let i = 0; i < relatedPrimaryEntities.blogs.length; i++) {
      const blog = relatedPrimaryEntities.blogs[i];
      if (!blog) {
        collectionErrors.relatedEntitiesMissing.push("blog");
        break;
      }
      if (!checkArticleLikeEntityIsValidAsSummary(blog, validLanguageIds)) {
        collectionErrors.relatedEntitiesInvalid.push("blog");
      }
    }

    for (let i = 0; i < relatedPrimaryEntities.recordedEvents.length; i++) {
      const recordedEvent = relatedPrimaryEntities.recordedEvents[i];
      if (!recordedEvent) {
        collectionErrors.relatedEntitiesMissing.push("recordedEvent");
        break;
      }
      if (
        !checkRecordedEventIsValidAsSummary(recordedEvent, validLanguageIds)
      ) {
        collectionErrors.relatedEntitiesInvalid.push("recordedEvent");
      }
    }

    const isError = checkObjectWithArrayFieldsHasValue(collectionErrors);

    if (isError) {
      return { status: "error", errors: collectionErrors };
    }

    return "good";
  }
);
