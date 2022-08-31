import { createSelector } from "@reduxjs/toolkit";

import { allLanguageId } from "^components/LanguageSelect";
import { fuzzySearch, mapIds, mapLanguageIds } from "^helpers/general";
import { checkDocHasTextContent, TipTapTextDoc } from "^helpers/tiptap";
import { RootState } from "^redux/store";
import { ArticleLikeError } from "^types/article-like-content";
import { Collection as CollectionType } from "^types/collection";
import { DisplayContentStatus } from "^types/display-content";
import { selectArticles } from "../articles";
import { selectBlogs } from "../blogs";
import { selectCollections } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectRecordedEvents } from "../recordedEvents";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";

export const selectCollectionsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const collections = selectCollections(state);

    const collectionsFilteredByLanguage =
      languageId === allLanguageId
        ? collections
        : collections.filter((doc) => {
            const { translations } = doc;
            const docLanguageIds = translations.flatMap((t) => t.languageId);
            const hasLanguage = docLanguageIds.includes(languageId);

            return hasLanguage;
          });

    if (!query.length) {
      return collectionsFilteredByLanguage;
    }

    const queryableCollections = collectionsFilteredByLanguage.map(
      (collection) => {
        const {
          id,
          subjectsIds,
          tagsIds,
          translations: collectionTranslations,
        } = collection;

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

        const collectionText = collectionTranslations.map((t) => t.title);

        return {
          id,
          collection: collectionText,
          subjects: subjectsText,
          tags: tagsText,
        };
      }
    );

    const collectionsMatchingQueryIds = fuzzySearch(
      ["collection", "subjects", "tags"],
      queryableCollections,
      query
    ).map((r) => r.item.id);

    const collectionsMatchQuery = collectionsMatchingQueryIds.map(
      (id) => collectionsFilteredByLanguage.find((a) => a.id === id)!
    );

    return collectionsMatchQuery;
  }
);

export const selectCollectionStatus = createSelector(
  [
    (state: RootState) => state,
    (_state, collection: CollectionType) => collection,
  ],
  (state, collection) => {
    const { lastSave, publishStatus } = collection;

    let status: DisplayContentStatus;

    if (!lastSave) {
      status = "new";
      return status;
    }

    if (publishStatus === "draft") {
      status = "draft";
      return status;
    }

    const { translations: collectionTranslations } = collection;

    const hasValidTranslation = collectionTranslations.find((translation) => {
      const { languageId, title, description } = translation;

      const languageIsValid = selectLanguageById(state, languageId);

      const hasTitle = title.length;

      const hasDescription = checkDocHasTextContent(
        description as TipTapTextDoc
      );

      if (languageIsValid && hasTitle && hasDescription) {
        return true;
      }
      return false;
    });

    if (!hasValidTranslation) {
      status = "invalid";
      return status;
    }

    const errors: ArticleLikeError[] = [];

    const { subjectsIds, tagsIds } = collection;

    const articleLanguagesIds = mapLanguageIds(collectionTranslations);
    const articleLanguages = selectLanguagesByIds(state, articleLanguagesIds);
    if (articleLanguages.includes(undefined)) {
      errors.push("missing language");
    }
    const validArticleLanguages = articleLanguages.flatMap((l) =>
      l ? [l] : []
    );
    const validArticleLanguagesIds = mapIds(validArticleLanguages);

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

export const selectPrimaryContentRelatedToCollection = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, collectionId: string) => collectionId,
  ],
  (state, collectionId) => {
    const articles = selectArticles(state);
    const relatedArticles = articles.filter((article) =>
      article.collectionsIds.includes(collectionId)
    );

    const blogs = selectBlogs(state);
    const relatedBlogs = blogs.filter((blog) =>
      blog.collectionsIds.includes(collectionId)
    );

    const recordedEvents = selectRecordedEvents(state);
    const relatedRecordedEvents = recordedEvents.filter((recordedEvent) =>
      recordedEvent.collectionsIds.includes(collectionId)
    );

    return {
      articles: relatedArticles,
      blogs: relatedBlogs,
      recordedEvents: relatedRecordedEvents,
    };
  }
);
