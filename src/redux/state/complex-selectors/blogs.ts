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

    const { translations: blogTranslations } = blog;

    const hasValidTranslation = blogTranslations.find((translation) => {
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

    const { authorsIds, collectionsIds, subjectsIds, tagsIds } = blog;

    // todo: if checking for missing translations, should do so in article translations too; check image validity

    const blogLanguagesIds = mapLanguageIds(blogTranslations);
    const blogLanguages = selectLanguagesByIds(state, blogLanguagesIds);
    if (blogLanguages.includes(undefined)) {
      errors.push("missing language");
    }
    const validBlogLanguages = blogLanguages.flatMap((l) => (l ? [l] : []));
    const validBlogLanguagesIds = mapIds(validBlogLanguages);

    const authors = selectAuthorsByIds(state, authorsIds);
    if (authors.includes(undefined)) {
      errors.push("missing author");
    }

    const authorsLanguagesIds = mapLanguageIds(
      authors.flatMap((a) => (a ? [a] : [])).flatMap((a) => a.translations)
    );

    for (let i = 0; i < validBlogLanguagesIds.length; i++) {
      const languageId = validBlogLanguagesIds[i];
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

    for (let i = 0; i < validBlogLanguagesIds.length; i++) {
      const languageId = validBlogLanguagesIds[i];
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

    for (let i = 0; i < validBlogLanguagesIds.length; i++) {
      const languageId = validBlogLanguagesIds[i];
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
