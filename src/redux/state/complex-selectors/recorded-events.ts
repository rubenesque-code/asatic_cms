import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";

import { fuzzySearch, mapIds, mapLanguageIds } from "^helpers/general";

import { RecordedEvent } from "^types/recordedEvent";
import { RecordedEventError } from "^types/recordedEvent";
import { DisplayContentStatus } from "^types/display-content";

import { selectRecordedEvents } from "../recordedEvents";
import { selectAuthorsByIds } from "../authors";
import { selectCollectionsByIds } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";

import { allLanguageId } from "^components/LanguageSelect";

export const selectRecordedEventsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const recordedEvents = selectRecordedEvents(state);

    const recordedEventsFilteredByLanguage =
      languageId === allLanguageId
        ? recordedEvents
        : recordedEvents.filter((doc) => {
            const { translations } = doc;
            const docLanguageIds = translations.flatMap((t) => t.languageId);
            const hasLanguage = docLanguageIds.includes(languageId);

            return hasLanguage;
          });

    if (!query.length) {
      return recordedEventsFilteredByLanguage;
    }

    const queryableRecordedEvents = recordedEventsFilteredByLanguage.map(
      (recordedEvent) => {
        const {
          id,
          authorsIds,
          collectionsIds,
          subjectsIds,
          tagsIds,
          translations: recordedEventTranslations,
        } = recordedEvent;

        const authors = selectAuthorsByIds(state, authorsIds).flatMap((a) =>
          a ? [a] : []
        );
        const authorsText = authors
          .flatMap((a) => a.translations)
          .flatMap((t) => t.name);

        const collections = selectCollectionsByIds(
          state,
          collectionsIds
        ).flatMap((c) => (c ? [c] : []));
        const collectionsText = collections
          .flatMap((c) => c.translations)
          .flatMap((t) => t.title);

        const subjects = selectSubjectsByIds(state, subjectsIds).flatMap((s) =>
          s ? [s] : []
        );
        const subjectsText = subjects
          .flatMap((s) => s.translations)
          .flatMap((t) => t.text);

        const tags = selectTagsByIds(state, tagsIds).flatMap((t) =>
          t ? [t] : []
        );
        const tagsText = tags.flatMap((t) => t.text);

        const recordedEventText = recordedEventTranslations.map((t) => t.title);

        return {
          id,
          recordedEvent: recordedEventText,
          authors: authorsText,
          collections: collectionsText,
          subjects: subjectsText,
          tags: tagsText,
        };
      }
    );

    const recordedEventsMatchingQueryIds = fuzzySearch(
      ["recordedEvent", "authors", "collections", "subjects", "tags"],
      queryableRecordedEvents,
      query
    ).map((r) => r.item.id);

    const recordedEventsMatchingQuery = recordedEventsMatchingQueryIds.map(
      (id) => recordedEventsFilteredByLanguage.find((a) => a.id === id)!
    );

    return recordedEventsMatchingQuery;
  }
);

export const selectRecordedEventStatus = createSelector(
  [
    (state: RootState) => state,
    (_state, recordedEvent: RecordedEvent) => recordedEvent,
  ],
  (state, recordedEvent) => {
    const { lastSave, publishStatus } = recordedEvent;

    let status: DisplayContentStatus;

    if (!lastSave) {
      status = "new";
      return status;
    }

    if (publishStatus === "draft") {
      status = "draft";
      return status;
    }

    const { translations: recordedEventTranslations } = recordedEvent;

    const hasValidTranslation = recordedEventTranslations.find(
      (translation) => {
        const { languageId, title } = translation;

        const languageIsValid = selectLanguageById(state, languageId);

        if (languageIsValid && title) {
          return true;
        }
        return false;
      }
    );

    if (!hasValidTranslation) {
      status = "invalid";
      return status;
    }

    const errors: RecordedEventError[] = [];

    const { authorsIds, collectionsIds, subjectsIds, tagsIds } = recordedEvent;

    const recordedEventLanguagesIds = mapLanguageIds(recordedEventTranslations);
    const recordedEventLanguages = selectLanguagesByIds(
      state,
      recordedEventLanguagesIds
    );
    if (recordedEventLanguages.includes(undefined)) {
      errors.push("missing language");
    }
    const validArticleLanguages = recordedEventLanguages.flatMap((l) =>
      l ? [l] : []
    );
    const validArticleLanguagesIds = mapIds(validArticleLanguages);

    const authors = selectAuthorsByIds(state, authorsIds);
    if (authors.includes(undefined)) {
      errors.push("missing author");
    }

    const authorsLanguagesIds = mapLanguageIds(
      authors.flatMap((a) => (a ? [a] : [])).flatMap((a) => a.translations)
    );

    for (let i = 0; i < validArticleLanguagesIds.length; i++) {
      const languageId = validArticleLanguagesIds[i];
      const isTranslationForLanguage = authorsLanguagesIds.includes(languageId);
      if (!isTranslationForLanguage) {
        errors.push("missing author translation");
        break;
      }
    }

    const collections = selectCollectionsByIds(state, collectionsIds);
    if (collections.includes(undefined)) {
      errors.push("missing collection");
    }

    const collectionsLanguagesIds = mapLanguageIds(
      collections.flatMap((c) => (c ? [c] : [])).flatMap((c) => c.translations)
    );

    for (let i = 0; i < validArticleLanguagesIds.length; i++) {
      const languageId = validArticleLanguagesIds[i];
      const isTranslationForLanguage =
        collectionsLanguagesIds.includes(languageId);
      if (!isTranslationForLanguage) {
        errors.push("missing collection translation");
        break;
      }
    }

    const subjects = selectSubjectsByIds(state, subjectsIds);
    if (subjects.includes(undefined)) {
      errors.push("missing subject");
    }

    const subjectsLanguagesIds = mapLanguageIds(
      subjects.flatMap((s) => (s ? [s] : [])).flatMap((s) => s.translations)
    );

    for (let i = 0; i < validArticleLanguagesIds.length; i++) {
      const languageId = validArticleLanguagesIds[i];
      const isTranslationForLanguage =
        subjectsLanguagesIds.includes(languageId);
      if (!isTranslationForLanguage) {
        errors.push("missing subject translation");
        break;
      }
    }

    const tags = selectTagsByIds(state, tagsIds);
    if (tags.includes(undefined)) {
      errors.push("missing tag");
    }

    if (errors.length) {
      status = { status: "error", errors };
      return status;
    }

    status = "good";
    return status;
  }
);
