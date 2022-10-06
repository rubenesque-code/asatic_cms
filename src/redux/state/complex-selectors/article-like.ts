import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectAuthorsByIds } from "../authors";
import { selectCollectionsByIds } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";

import { checkBodyHasText } from "^helpers/article-like";

import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { PrimaryEntityError, PrimaryEntityStatus } from "^types/primary-entity";
import { mapIds, mapLanguageIds } from "^helpers/general";
import { handleTranslatableRelatedEntityErrors } from "./helpers";

export const selectArticleLikeStatus = createSelector(
  [(state: RootState) => state, (_state, entity: Article | Blog) => entity],
  (state, entity) => {
    const { lastSave, publishStatus } = entity;

    let status: PrimaryEntityStatus;

    if (!lastSave) {
      status = "new";
      return status;
    }

    if (publishStatus === "draft") {
      status = "draft";
      return status;
    }

    const { translations: entityTranslations } = entity;

    const hasValidTranslation = entityTranslations.find((translation) => {
      const { languageId, title, body } = translation;

      const languageIsValid = selectLanguageById(state, languageId);

      const hasText = checkBodyHasText(body);

      if (languageIsValid && title && hasText) {
        return true;
      }
      return false;
    });

    if (!hasValidTranslation) {
      status = "invalid";
      return status;
    }

    const entityErrors: PrimaryEntityError[] = [];

    const entityLanguages = selectLanguagesByIds(
      state,
      mapLanguageIds(entityTranslations)
    );
    if (entityLanguages.includes(undefined)) {
      entityErrors.push("missing language");
    }

    const entityValidLanguagesIds = mapIds(
      entityLanguages.flatMap((l) => (l ? [l] : []))
    );

    const entityAuthors = selectAuthorsByIds(state, entity.authorsIds);

    handleTranslatableRelatedEntityErrors({
      entityLanguagesIds: entityValidLanguagesIds,
      onMissingEntity: () => entityErrors.push("missing author"),
      onMissingEntityTranslation: () =>
        entityErrors.push("missing author translation"),
      relatedEntities: entityAuthors,
    });

    const entityCollections = selectCollectionsByIds(
      state,
      entity.collectionsIds
    );

    handleTranslatableRelatedEntityErrors({
      entityLanguagesIds: entityValidLanguagesIds,
      onMissingEntity: () => entityErrors.push("missing collection"),
      onMissingEntityTranslation: () =>
        entityErrors.push("missing collection translation"),
      relatedEntities: entityCollections,
    });

    const entitySubjects = selectSubjectsByIds(state, entity.subjectsIds);

    handleTranslatableRelatedEntityErrors({
      entityLanguagesIds: entityValidLanguagesIds,
      onMissingEntity: () => entityErrors.push("missing subject"),
      onMissingEntityTranslation: () =>
        entityErrors.push("missing subject translation"),
      relatedEntities: entitySubjects,
    });

    const entityTags = selectTagsByIds(state, entity.tagsIds);
    if (entityTags.includes(undefined)) {
      entityErrors.push("missing tag");
    }

    if (entityErrors.length) {
      status = { status: "error", errors: entityErrors };
      return status;
    }

    status = "good";
    return status;
  }
);
