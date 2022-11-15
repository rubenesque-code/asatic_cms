import { createSelector } from "@reduxjs/toolkit";
import { applyFilters } from "^helpers/general";

import { RootState } from "^redux/store";
import { selectArticles as selectArticles } from "../articles";

import {
  filterEntitiesByLanguage,
  filterPrimaryEntitiesByQuery,
} from "./helpers";

export const selectArticlesByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: { languageId: string; query: string; excludedIds?: string[] }
    ) => filters,
  ],
  (state, { languageId, query, excludedIds }) => {
    const articles = selectArticles(state);

    const articlesFiltered = applyFilters(articles, [
      (articles) =>
        articles.filter((article) => !excludedIds?.includes(article.id)),
      (articles) => filterEntitiesByLanguage(articles, languageId),
      (articles) => filterPrimaryEntitiesByQuery(state, articles, query),
    ]);

    return articlesFiltered;
  }
);
