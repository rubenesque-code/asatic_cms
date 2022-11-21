import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectSubjectsByIds } from "^redux/state/subjects";
import {
  selectLanguagesByIds,
  selectLanguagesIds,
} from "^redux/state/languages";
import { selectTagsByIds } from "^redux/state/tags";
import { selectAuthorsByIds } from "^redux/state/authors";
import { selectCollectionsByIds } from "^redux/state/collections";

import {
  checkObjectWithArrayFieldsHasValue,
  mapIds,
  mapLanguageIds,
} from "^helpers/general";
import {
  handleOwnTranslationWarnings,
  handleRelatedEntityWarnings,
} from "./helpers";
import { checkRelatedSubjectIsValid } from "^helpers/subject";
import { checkRelatedTagIsValid } from "^helpers/tag";
import { checkRelatedCollectionIsValid } from "^helpers/collection";
import { checkRelatedAuthorIsValid } from "^helpers/author";
import {
  checkHasValidTranslation,
  checkIsValidTranslation,
} from "^helpers/article-like";

import { Article } from "^types/article";
import { Blog } from "^types/blog";
import {
  ArticleLikeRelatedEntity,
  ArticleLikeStatus,
} from "^types/article-like-entity";
import { EntityWarning } from "^types/entity-status";

export const selectArticleLikeStatus = createSelector(
  [(state: RootState) => state, (_state, entity: Article | Blog) => entity],
  (state, articleLikeEntity): ArticleLikeStatus => {
    if (!articleLikeEntity.lastSave) {
      return "new";
    }

    if (articleLikeEntity.publishStatus === "draft") {
      return "draft";
    }

    const relatedLanguages = selectLanguagesByIds(
      state,
      mapLanguageIds(articleLikeEntity.translations)
    );
    const validRelatedLanguageIds = mapIds(
      relatedLanguages.flatMap((e) => (e ? [e] : []))
    );

    const hasValidTranslation = checkHasValidTranslation(
      articleLikeEntity.translations,
      validRelatedLanguageIds
    );

    if (!hasValidTranslation) {
      // return "invalid";
      return {
        status: "invalid",
        reasons: ["no valid translation"],
      };
    }

    const warnings: EntityWarning<ArticleLikeRelatedEntity> = {
      ownTranslationsWithoutRequiredField: [],
      relatedEntitiesMissing: [],
      relatedEntitiesInvalid: [],
    };

    handleOwnTranslationWarnings({
      translations: articleLikeEntity.translations,
      checkValidity: (translation) =>
        checkIsValidTranslation(translation, validRelatedLanguageIds),
      onInvalid: (translation) =>
        warnings.ownTranslationsWithoutRequiredField.push({
          languageId: translation.languageId,
        }),
    });

    if (relatedLanguages.includes(undefined)) {
      warnings.relatedEntitiesMissing.push("language");
    }

    const relatedSubjects = selectSubjectsByIds(
      state,
      articleLikeEntity.subjectsIds
    );

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "subject",
        entities: relatedSubjects,
        checkValidity: checkRelatedSubjectIsValid,
      },
    });

    const relatedTags = selectTagsByIds(state, articleLikeEntity.tagsIds);

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "tag",
        entities: relatedTags,
        checkValidity: checkRelatedTagIsValid,
      },
    });

    const relatedCollections = selectCollectionsByIds(
      state,
      articleLikeEntity.collectionsIds
    );

    const allLanguageIds = selectLanguagesIds(state) as string[];

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "collection",
        entities: relatedCollections,
        checkValidity: (collection) =>
          checkRelatedCollectionIsValid(collection, allLanguageIds),
      },
    });

    const relatedAuthors = selectAuthorsByIds(
      state,
      articleLikeEntity.authorsIds
    );

    handleRelatedEntityWarnings({
      entityWarnings: warnings,
      relatedEntity: {
        type: "author",
        entities: relatedAuthors,
        checkValidity: (author) =>
          checkRelatedAuthorIsValid(author, validRelatedLanguageIds),
      },
    });

    const isError = checkObjectWithArrayFieldsHasValue(warnings);

    if (isError) {
      return { status: "warning", warnings };
    }

    return "good";
  }
);
