import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";

import { fuzzySearch, mapIds, mapLanguageIds } from "^helpers/general";
import { checkDocHasTextContent, TipTapTextDoc } from "^helpers/tiptap";

import { Article } from "^types/article";
import { ArticleLikeError } from "^types/article-like-content";
import { DisplayContentStatus } from "^types/display-content";

import { selectArticles as selectArticles } from "../articles";
import { selectAuthorsByIds } from "../authors";
import { selectCollectionsByIds } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";

import { allLanguageId } from "^components/LanguageSelect";

// todo: passing object as paramater causes unwanted rererenders?
export const selectArticlesByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const articles = selectArticles(state);

    const articlesFilteredByLanguage =
      languageId === allLanguageId
        ? articles
        : articles.filter((doc) => {
            const { translations } = doc;
            const docLanguageIds = translations.flatMap((t) => t.languageId);
            const hasLanguage = docLanguageIds.includes(languageId);

            return hasLanguage;
          });

    if (!query.length) {
      return articlesFilteredByLanguage;
    }

    const queryableArticles = articlesFilteredByLanguage.map((article) => {
      const {
        id,
        authorsIds,
        collectionsIds,
        subjectsIds,
        tagsIds,
        translations: articleTranslations,
      } = article;

      const authors = selectAuthorsByIds(state, authorsIds).flatMap((a) =>
        a ? [a] : []
      );
      const authorsText = authors
        .flatMap((a) => a.translations)
        .flatMap((t) => t.name);

      const collections = selectCollectionsByIds(state, collectionsIds).flatMap(
        (c) => (c ? [c] : [])
      );
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

      const articleText = articleTranslations.map((t) => t.title);

      return {
        id,
        article: articleText,
        authors: authorsText,
        collections: collectionsText,
        subjects: subjectsText,
        tags: tagsText,
      };
    });

    const articlesMatchingQueryIds = fuzzySearch(
      ["article", "authors", "collections", "subjects", "tags"],
      queryableArticles,
      query
    ).map((r) => r.item.id);

    const articlesMatchQuery = articlesMatchingQueryIds.map(
      (id) => articlesFilteredByLanguage.find((a) => a.id === id)!
    );

    return articlesMatchQuery;
  }
);

export const selectArticleStatus = createSelector(
  [(state: RootState) => state, (_state, article: Article) => article],
  (state, article) => {
    const { lastSave, publishStatus } = article;

    let status: DisplayContentStatus;

    if (!lastSave) {
      status = "new";
      return status;
    }

    if (publishStatus === "draft") {
      status = "draft";
      return status;
    }

    const { translations: articleTranslations } = article;

    const hasValidTranslation = articleTranslations.find((translation) => {
      const { languageId, title, body } = translation;

      const languageIsValid = selectLanguageById(state, languageId);

      const hasText = body
        .flatMap((section) => (section.type === "text" ? [section] : []))
        .filter((textSection) => textSection.text)
        .find((textSection) =>
          checkDocHasTextContent(textSection.text as TipTapTextDoc)
        );

      if (languageIsValid && title && hasText) {
        return true;
      }
      return false;
    });

    if (!hasValidTranslation) {
      status = "invalid";
      return status;
    }

    const errors: ArticleLikeError[] = [];

    const { authorsIds, tagsIds } = article;

    // todo: if checking for missing translations, should do so in article translations too; check image validity

    const articleLanguagesIds = mapLanguageIds(articleTranslations);
    const articleLanguages = selectLanguagesByIds(state, articleLanguagesIds);
    if (articleLanguages.includes(undefined)) {
      errors.push("missing language");
    }
    const validArticleLanguages = articleLanguages.flatMap((l) =>
      l ? [l] : []
    );
    const validArticleLanguagesIds = mapIds(validArticleLanguages);

    const articleAuthors = selectAuthorsByIds(state, authorsIds);
    if (articleAuthors.includes(undefined)) {
      errors.push("missing author");
    }

    for (let i = 0; i < articleAuthors.length; i++) {
      const articleAuthor = articleAuthors[i];
      if (articleAuthor) {
        const articleAuthorLanguageIds = mapLanguageIds(
          articleAuthor.translations
        );
        for (let j = 0; j < validArticleLanguagesIds.length; j++) {
          const articleLanguageId = validArticleLanguagesIds[j];
          if (!articleAuthorLanguageIds.includes(articleLanguageId)) {
            errors.push("missing author translation");
          }
        }
      }
    }

    const articleCollections = selectCollectionsByIds(
      state,
      article.collectionsIds
    );
    if (articleCollections.includes(undefined)) {
      errors.push("missing collection");
    }

    for (let i = 0; i < articleCollections.length; i++) {
      const articleCollection = articleCollections[i];
      if (articleCollection) {
        const articleCollectionLanguageIds = mapLanguageIds(
          articleCollection.translations
        );
        for (let j = 0; j < validArticleLanguagesIds.length; j++) {
          const articleLanguageId = validArticleLanguagesIds[j];
          if (!articleCollectionLanguageIds.includes(articleLanguageId)) {
            errors.push("missing collection translation");
          }
        }
      }
    }

    const articleSubjects = selectSubjectsByIds(state, article.subjectsIds);
    if (articleSubjects.includes(undefined)) {
      errors.push("missing subject");
    }

    for (let i = 0; i < articleSubjects.length; i++) {
      const articleSubject = articleSubjects[i];
      if (articleSubject) {
        const articleSubjectLanguageIds = mapLanguageIds(
          articleSubject.translations
        );
        for (let j = 0; j < validArticleLanguagesIds.length; j++) {
          const articleLanguageId = validArticleLanguagesIds[j];
          if (!articleSubjectLanguageIds.includes(articleLanguageId)) {
            errors.push("missing subject translation");
          }
        }
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
