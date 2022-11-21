import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectArticlesByIds } from "../../articles";
import { selectBlogsByIds } from "../../blogs";
import { selectLanguagesByIds, selectLanguagesIds } from "../../languages";
import { selectRecordedEventsByIds } from "../../recordedEvents";
import { selectSubjectsByIds } from "../../subjects";
import { selectTagsByIds } from "../../tags";

import {
  checkObjectWithArrayFieldsHasValue,
  mapIds,
  mapLanguageIds,
} from "^helpers/general";
import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "^helpers/article-like";
import {
  checkHasValidRelatedPrimaryEntity,
  checkHasValidTranslation as checkCollectionHasValidTranslation,
  checkIsValidTranslation as checkIsValidCollectionTranslation,
} from "^helpers/collection";
import { checkRelatedSubjectIsValid } from "^helpers/subject";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "^helpers/recorded-event";
import { checkRelatedTagIsValid } from "^helpers/tag";
import { EntityWarning } from "^types/entity-status";
import {
  handleOwnTranslationWarnings,
  handleRelatedEntityWarnings,
} from "./helpers";

import {
  Collection,
  CollectionStatus,
  CollectionRelatedEntity,
  InvalidReason,
} from "^types/collection";

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
      invalidReasons.push("no valid translation");
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

    handleOwnTranslationWarnings({
      translations: collection.translations,
      checkValidity: (translation) =>
        checkIsValidCollectionTranslation(translation, validRelatedLanguageIds),
      onInvalid: (translation) =>
        warnings.ownTranslationsWithoutRequiredField.push({
          languageId: translation.languageId,
        }),
    });

    if (relatedLanguages.includes(undefined)) {
      warnings.relatedEntitiesMissing.push("language");
    }

    const relatedSubjects = selectSubjectsByIds(state, collection.subjectsIds);

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "subject",
        entities: relatedSubjects,
        checkValidity: checkRelatedSubjectIsValid,
      },
    });

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
