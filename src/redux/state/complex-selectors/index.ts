import { createSelector } from "@reduxjs/toolkit";
import { allLanguageId, AllLanguageId } from "^components/LanguageSelect";
import { RootState } from "^redux/store";
import { selectAll as selectArticles } from "../articles";

export const selectArticlesByLanguageId = createSelector(
  [
    selectArticles,
    (state: RootState, languageId: string | AllLanguageId) => languageId,
  ],
  (articles, languageId) =>
    languageId === allLanguageId
      ? articles
      : articles.filter((doc) => {
          const { translations } = doc;
          const docLanguageIds = translations.flatMap((t) => t.languageId);
          const hasLanguage = docLanguageIds.includes(languageId);

          return hasLanguage;
        })
);

// selectArticlesByLanguage({}, )
// type P = Parameters<typeof selectArticlesByLanguage>[1]

// export const selectArticlesByLanguageAndQueryString = createSelector
