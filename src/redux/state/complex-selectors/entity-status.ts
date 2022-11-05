import { createSelector } from "@reduxjs/toolkit";
import {
  checkContainsValidTranslation,
  checkIsValidTranslation,
} from "^helpers/collection";
import { mapIds, mapLanguageIds } from "^helpers/general";

import { RootState } from "^redux/store";
import {
  Collection,
  CollectionStatus,
  CollectionRelatedEntity,
} from "^types/collection";
import { RelatedEntityFields } from "^types/entity";
import { EntityError } from "^types/entity-status";
import { selectLanguagesByIds } from "../languages";
import { selectSubjectsByIds } from "../subjects";

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

    const relatedEntities: RelatedEntityFields<CollectionRelatedEntity> = {
      articlesIds: collection.articlesIds,
      blogsIds: collection.blogsIds,
      recordedEventsIds: collection.recordedEventsIds,
      subjectsIds: collection.subjectsIds,
      tagsIds: collection.tagsIds,
    };

    const isRelatedContent = Object.values(relatedEntities).flatMap(
      (ids) => ids
    ).length;

    if (!isRelatedContent) {
      status = "invalid";
      return status;
    }

    const relatedLanguages = selectLanguagesByIds(
      state,
      mapLanguageIds(collection.translations)
    );
    const validLanguageIds = mapIds(
      relatedLanguages.flatMap((e) => (e ? [e] : []))
    );

    const containsValidTranslation = checkContainsValidTranslation(
      collection.translations,
      validLanguageIds
    );

    if (!containsValidTranslation) {
      status = "invalid";
      return status;
    }

    const collectionErrors: EntityError<CollectionRelatedEntity> = {};

    for (let i = 0; i < collection.translations.length; i++) {
      const translation = collection.translations[i];
      if (!checkIsValidTranslation(translation, validLanguageIds)) {
        if (collectionErrors.translationsWithMissingRequiredField) {
          collectionErrors.translationsWithMissingRequiredField.push({
            languageId: translation.languageId,
          });
        } else {
          collectionErrors.translationsWithMissingRequiredField = [
            { languageId: translation.languageId },
          ];
        }
      }
    }

    if (relatedLanguages.includes(undefined)) {
      if (collectionErrors.missingEntities) {
        collectionErrors.missingEntities.push("language");
      } else {
        collectionErrors.missingEntities = ["language"];
      }
    }

    const relatedSubjects = selectSubjectsByIds(state, collection.subjectsIds);

    handleTranslatableRelatedEntityErrors({
      entityLanguagesIds: collectionValidLanguagesIds,
      onMissingEntity: () => collectionErrors.push("missing subject"),
      onMissingEntityTranslation: () =>
        collectionErrors.push("missing subject translation"),
      relatedEntities: relatedSubjects,
    });

    const tags = selectTagsByIds(state, collection.tagsIds);
    if (tags.includes(undefined)) {
      collectionErrors.push("missing tag");
    }

    handleRelatedArticleLikeErrors(relatedEntities.articles, {
      missingEntity: () => collectionErrors.push("missing article"),
      missingTranslation: () => collectionErrors.push("missing article fields"),
    });
    handleRelatedArticleLikeErrors(relatedEntities.blogs, {
      missingEntity: () => collectionErrors.push("missing blog"),
      missingTranslation: () => collectionErrors.push("missing blog fields"),
    });
    handleRelatedRecordedEventErrors(relatedEntities.recordedEvents, {
      missingEntity: () => collectionErrors.push("missing recorded event"),
      missingTranslation: () =>
        collectionErrors.push("missing recorded event fields"),
    });

    if (collectionErrors.length) {
      status = { status: "error", errors: collectionErrors };
      return status;
    }

    status = "good";
    return status;
  }
);
