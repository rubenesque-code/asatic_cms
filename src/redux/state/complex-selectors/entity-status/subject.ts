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
  checkHasValidTranslation as checkSubjectHasValidTranslation,
  checkIsValidTranslation as checkIsValidSubjectTranslation,
} from "^helpers/subject";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "^helpers/recorded-event";
import { checkRelatedTagIsValid } from "^helpers/tag";
import { checkRelatedCollectionIsValid } from "^helpers/collection";
import {
  handleOwnTranslationWarnings,
  handleRelatedEntityWarnings,
} from "./_helpers";

import { EntityWarning } from "^types/entity-status";
import {
  Subject,
  SubjectStatus,
  SubjectRelatedEntity,
  InvalidReason,
  SubjectAsChildStatus,
} from "^types/subject";
import { selectSubjectsByIds } from "^redux/state/subjects";

export const selectSubjectStatus = createSelector(
  [(state: RootState) => state, (_state, subject: Subject) => subject],
  (state, subject): SubjectStatus => {
    if (!subject.lastSave) {
      return "new";
    }

    if (subject.publishStatus === "draft") {
      return "draft";
    }

    const relatedLanguages = {
      entities: selectLanguagesByIds(
        state,
        mapLanguageIds(subject.translations)
      ),
      get validIds() {
        return mapIds(this.entities.flatMap((e) => (e ? [e] : [])));
      },
    };

    const invalidReasons: InvalidReason[] = [];

    const hasValidTranslation = checkSubjectHasValidTranslation(
      subject.translations,
      relatedLanguages.validIds
    );

    if (!hasValidTranslation) {
      invalidReasons.push("no valid translation");
    }

    const relatedDisplayEntities = {
      articles: {
        all: selectArticlesByIds(state, subject.articlesIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
      },
      blogs: {
        all: selectBlogsByIds(state, subject.blogsIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
      },
      collections: {
        all: selectCollectionsByIds(state, subject.collectionsIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
      },
      recordedEvents: {
        all: selectRecordedEventsByIds(state, subject.recordedEventsIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
      },
    };

    const allLanguageIds = selectLanguagesIds(state) as string[];

    const hasValidPrimaryEntity = checkHasValidRelatedPrimaryEntity({
      articleLikeEntities: [
        ...relatedDisplayEntities.articles.found,
        ...relatedDisplayEntities.blogs.found,
      ],
      collections: relatedDisplayEntities.collections.found,
      recordedEvents: relatedDisplayEntities.recordedEvents.found,
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

    const warnings: EntityWarning<SubjectRelatedEntity> = {
      ownTranslationsWithoutRequiredField: [],
      relatedEntitiesMissing: [],
      relatedEntitiesInvalid: [],
    };

    handleOwnTranslationWarnings({
      translations: subject.translations,
      checkValidity: (translation) =>
        checkIsValidSubjectTranslation(translation, relatedLanguages.validIds),
      onInvalid: (translation) =>
        warnings.ownTranslationsWithoutRequiredField.push({
          languageId: translation.languageId,
        }),
    });

    if (relatedLanguages.entities.includes(undefined)) {
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
        entities: relatedDisplayEntities.articles.all,
        checkValidity: (article) =>
          checkArticleLikeEntityIsValidAsSummary(article, allLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "blog",
        entities: relatedDisplayEntities.blogs.all,
        checkValidity: (blog) =>
          checkArticleLikeEntityIsValidAsSummary(blog, allLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "collection",
        entities: relatedDisplayEntities.collections.all,
        checkValidity: (collection) =>
          checkRelatedCollectionIsValid(collection, allLanguageIds),
      },
    });

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "recordedEvent",
        entities: relatedDisplayEntities.recordedEvents.all,
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

export const selectEntitySubjectsStatus = createSelector(
  [
    (state: RootState) => state,
    selectSubjectsByIds,
    (_state: RootState, _subjectsIds: string[], entityLanguagesIds: string[]) =>
      entityLanguagesIds,
  ],
  (state, subjects, entityLanguagesIds) => {
    const statusArr = subjects.map((subject) =>
      selectEntitySubjectStatus(state, subject, entityLanguagesIds)
    );

    return statusArr;
  }
);

export const selectEntitySubjectStatus = createSelector(
  [
    (state: RootState) => state,
    (_state, subject: Subject | undefined) => subject,
    (
      _state,
      _subject: Subject | undefined,
      parentEntityLanguageIds: string[]
    ) => parentEntityLanguageIds,
  ],
  (state, subject, parentEntityLanguageIds): SubjectAsChildStatus => {
    if (!subject) {
      return "undefined";
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

    const hasValidTranslation = checkSubjectHasValidTranslation(
      subject.translations,
      validRelatedLanguageIds
    );

    if (!hasValidTranslation) {
      return {
        status: "invalid",
        missingRequirements: ["no valid translation"],
      };
    }

    for (let i = 0; i < parentEntityLanguageIds.length; i++) {
      const parentLanguageId = parentEntityLanguageIds[i];
      if (!mapLanguageIds(subject.translations).includes(parentLanguageId)) {
        return {
          status: "warning",
          warnings: ["missing translation for parent language"],
        };
      }
    }

    return "good";
  }
);
