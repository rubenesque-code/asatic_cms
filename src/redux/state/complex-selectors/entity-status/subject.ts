import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectArticlesByIds } from "../../articles";
import { selectBlogsByIds } from "../../blogs";
import { selectCollectionsByIds } from "^redux/state/collections";
import { selectLanguagesByIds, selectLanguagesIds } from "../../languages";
import { selectRecordedEventsByIds } from "../../recordedEvents";
import { selectTagsByIds } from "../../tags";

import {
  checkObjectWithArrayFieldsHasValue,
  mapIds,
  mapLanguageIds,
} from "^helpers/general";
import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "^helpers/article-like";
import {
  checkHasValidRelatedPrimaryEntity,
  checkHasValidSiteTranslations,
  checkIsValidTranslation as checkIsValidSubjectTranslation,
} from "^helpers/subject";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "^helpers/recorded-event";
import { checkRelatedTagIsValid } from "^helpers/tag";
import { checkRelatedCollectionIsValid } from "^helpers/collection";
import {
  handleOwnTranslationWarnings,
  handleRelatedEntityWarnings,
} from "./helpers";

import { EntityWarning } from "^types/entity-status";
import { Subject, SubjectStatus, SubjectRelatedEntity } from "^types/subject";

export const selectSubjectStatus = createSelector(
  [(state: RootState) => state, (_state, subject: Subject) => subject],
  (state, subject): SubjectStatus => {
    if (!subject.lastSave) {
      return "new";
    }

    if (subject.publishStatus === "draft") {
      return "draft";
    }

    const relatedLanguages = selectLanguagesByIds(
      state,
      mapLanguageIds(subject.translations)
    );
    const validRelatedLanguageIds = mapIds(
      relatedLanguages.flatMap((e) => (e ? [e] : []))
    );

    const hasSiteTranslations = checkHasValidSiteTranslations(
      subject.translations
    );

    if (!hasSiteTranslations) {
      return "invalid";
    }

    const relatedDisplayEntities = {
      articles: selectArticlesByIds(state, subject.articlesIds),
      blogs: selectBlogsByIds(state, subject.blogsIds),
      collections: selectCollectionsByIds(state, subject.collectionsIds),
      recordedEvents: selectRecordedEventsByIds(
        state,
        subject.recordedEventsIds
      ),
    };
    const foundRelatedDisplayEntities = {
      articles: relatedDisplayEntities.articles.flatMap((a) => (a ? [a] : [])),
      blogs: relatedDisplayEntities.blogs.flatMap((b) => (b ? [b] : [])),
      collections: relatedDisplayEntities.collections.flatMap((c) =>
        c ? [c] : []
      ),
      recordedEvents: relatedDisplayEntities.recordedEvents.flatMap((r) =>
        r ? [r] : []
      ),
    };

    const allLanguageIds = selectLanguagesIds(state) as string[];

    const hasValidPrimaryEntity = checkHasValidRelatedPrimaryEntity({
      articleLikeEntities: [
        ...foundRelatedDisplayEntities.articles,
        ...foundRelatedDisplayEntities.blogs,
      ],
      collections: foundRelatedDisplayEntities.collections,
      recordedEvents: foundRelatedDisplayEntities.recordedEvents,
      allLanguageIds,
    });

    if (!hasValidPrimaryEntity) {
      return "invalid";
    }

    const warnings: EntityWarning<SubjectRelatedEntity> = {
      ownTranslationsWithoutRequiredField: [],
      relatedEntitiesMissing: [],
      relatedEntitiesInvalid: [],
    };

    handleOwnTranslationWarnings({
      translations: subject.translations,
      checkValidity: (translation) =>
        checkIsValidSubjectTranslation(translation, validRelatedLanguageIds),
      onInvalid: (translation) =>
        warnings.ownTranslationsWithoutRequiredField.push({
          languageId: translation.languageId,
        }),
    });

    if (relatedLanguages.includes(undefined)) {
      warnings.relatedEntitiesMissing.push("language");
    }

    const relatedTags = selectTagsByIds(state, subject.tagsIds);

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
        entities: relatedDisplayEntities.articles,
        checkValidity: (article) =>
          checkArticleLikeEntityIsValidAsSummary(article, allLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "blog",
        entities: relatedDisplayEntities.blogs,
        checkValidity: (blog) =>
          checkArticleLikeEntityIsValidAsSummary(blog, allLanguageIds),
      },
    });

    const relatedCollections = selectCollectionsByIds(
      state,
      subject.collectionsIds
    );

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "collection",
        entities: relatedCollections,
        checkValidity: (collection) =>
          checkRelatedCollectionIsValid(collection, allLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "recordedEvent",
        entities: relatedDisplayEntities.recordedEvents,
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
