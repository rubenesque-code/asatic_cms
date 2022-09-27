import { createSelector } from "@reduxjs/toolkit";
import { allLanguageId } from "^components/LanguageSelect";
import { fuzzySearch, mapIds, mapLanguageIds } from "^helpers/general";
import { checkDocHasTextContent, TipTapTextDoc } from "^helpers/tiptap";
import { RootState } from "^redux/store";
import { ArticleLikeError } from "^types/article-like-content";
import { DisplayContentStatus } from "^types/display-content";
import { selectBlogs } from "../blogs";
import { selectAuthorsByIds } from "../authors";
import { selectCollectionsByIds } from "../collections";
import { selectLanguageById, selectLanguagesByIds } from "../languages";
import { selectSubjectsByIds } from "../subjects";
import { selectTagsByIds } from "../tags";
import { Blog } from "^types/blog";

// todo: passing object as paramater causes unwanted rererenders?
export const selectBlogsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const blogs = selectBlogs(state);

    const blogsFilteredByLanguage =
      languageId === allLanguageId
        ? blogs
        : blogs.filter((doc) => {
            const { translations } = doc;
            const docLanguageIds = translations.flatMap((t) => t.languageId);
            const hasLanguage = docLanguageIds.includes(languageId);

            return hasLanguage;
          });

    if (!query.length) {
      return blogsFilteredByLanguage;
    }

    const queryableBlogs = blogsFilteredByLanguage.map((blog) => {
      const {
        id,
        authorsIds,
        collectionsIds,
        subjectsIds,
        tagsIds,
        translations: blogTranslations,
      } = blog;

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

      const blogText = blogTranslations.map((t) => t.title);

      return {
        id,
        blog: blogText,
        authors: authorsText,
        collections: collectionsText,
        subjects: subjectsText,
        tags: tagsText,
      };
    });

    const blogsMatchingQueryIds = fuzzySearch(
      ["blog", "authors", "collections", "subjects", "tags"],
      queryableBlogs,
      query
    ).map((r) => r.item.id);

    const blogsMatchQuery = blogsMatchingQueryIds.map(
      (id) => blogsFilteredByLanguage.find((a) => a.id === id)!
    );

    return blogsMatchQuery;
  }
);

export const selectBlogStatus = createSelector(
  [(state: RootState) => state, (_state, blog: Blog) => blog],
  (state, blog) => {
    const { lastSave, publishStatus } = blog;

    let status: DisplayContentStatus;

    if (!lastSave) {
      status = "new";
      return status;
    }

    if (publishStatus === "draft") {
      status = "draft";
      return status;
    }

    const { translations: articleTranslations } = blog;

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

    const { authorsIds, tagsIds } = blog;

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

    const articleCollections = selectCollectionsByIds(
      state,
      blog.collectionsIds
    );
    if (articleCollections.includes(undefined)) {
      errors.push("missing collection");
    }

    // check translation exists for each collection for each article language

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

    const articleSubjects = selectSubjectsByIds(state, blog.subjectsIds);
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
