import { createSelector } from "@reduxjs/toolkit";

import { applyFilters, mapIds, mapLanguageIds } from "^helpers/general";

import { RootState } from "^redux/store";
import { PrimaryEntityError, PrimaryEntityStatus } from "^types/primary-entity";
import { RecordedEvent } from "^types/recordedEvent";
import { selectAuthorsByIds } from "../authors";
import { selectCollectionsByIds } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectRecordedEvents } from "../recordedEvents";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";

import {
  filterEntitiesByLanguage,
  filterPrimaryEntitiesByQuery,
  handleTranslatableRelatedEntityErrors,
} from "./helpers";

export const selectRecordedEventStatus = createSelector(
  [(state: RootState) => state, (_state, entity: RecordedEvent) => entity],
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

    if (!entity.youtubeId) {
      status = "invalid";
      return status;
    }

    const { translations: entityTranslations } = entity;

    const hasValidTranslation = entityTranslations.find((translation) => {
      const { languageId, title } = translation;

      const languageIsValid = selectLanguageById(state, languageId);

      if (languageIsValid && title) {
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

export const selectRecordedEventsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const recordedEvents = selectRecordedEvents(state);

    const filtered = applyFilters(recordedEvents, [
      (recordedEvents) => filterEntitiesByLanguage(recordedEvents, languageId),
      (recordedEvents) =>
        filterPrimaryEntitiesByQuery(state, recordedEvents, query),
    ]);

    return filtered;
  }
);
