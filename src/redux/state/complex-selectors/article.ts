import { createSelector } from "@reduxjs/toolkit";
import { applyFilters, mapLanguageIds } from "^helpers/general";

import { RootState } from "^redux/store";
import {
  selectArticles as selectArticles,
  selectArticlesByIds,
} from "../articles";

import {
  filterEntitiesByLanguage,
  filterPrimaryEntitiesByQuery,
} from "./helpers";

export const selectArticlesByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: {
        languageId: string;
        query: string;
        excludedIds?: string[];
      }
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

export const selectArticlesByLanguage = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: {
        languageId: string;
        excludedIds?: string[];
      }
    ) => filters,
  ],
  (state, { languageId, excludedIds }) => {
    const articles = selectArticles(state);

    const articlesFiltered = applyFilters(articles, [
      (articles) =>
        articles.filter((article) => !excludedIds?.includes(article.id)),
      (articles) => filterEntitiesByLanguage(articles, languageId),
    ]);

    return articlesFiltered;
  }
);

export const selectArticlesByIdsAndLanguageId = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: {
        ids: string[];
        languageId: string;
      }
    ) => filters,
  ],
  (state, { languageId, ids }) => {
    const articles = selectArticlesByIds(state, ids);

    const found = articles.flatMap((article) => (article ? [article] : []));
    const numMissing = articles.length - found.length;

    const valid = found.filter((article) =>
      mapLanguageIds(article.translations).includes(languageId)
    );
    const invalid = found.filter(
      (article) => !mapLanguageIds(article.translations).includes(languageId)
    );

    return {
      numMissing,
      valid,
      invalid: {
        entities: invalid,
        reason: "no translation for parent language",
      },
    };
  }
);
