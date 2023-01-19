import { createSelector } from "@reduxjs/toolkit";
import { applyFilters, mapLanguageIds } from "^helpers/general";

import { RootState } from "^redux/store";
import { selectBlogs, selectBlogsByIds } from "../blogs";

import {
  filterEntitiesByLanguage,
  filterPrimaryEntitiesByQuery,
} from "./helpers";

export const selectBlogsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: { languageId: string; query: string; excludedIds?: string[] }
    ) => filters,
  ],
  (state, { languageId, query, excludedIds }) => {
    const blogs = selectBlogs(state);

    const blogsFiltered = applyFilters(blogs, [
      (blogs) => blogs.filter((blog) => !excludedIds?.includes(blog.id)),
      (blogs) => filterEntitiesByLanguage(blogs, languageId),
      (blogs) => filterPrimaryEntitiesByQuery(state, blogs, query),
    ]);

    return blogsFiltered;
  }
);

export const selectBlogsByLanguage = createSelector(
  [
    (state: RootState) => state,
    (
      _state: RootState,
      filters: { languageId: string; excludedIds?: string[] }
    ) => filters,
  ],
  (state, { languageId, excludedIds }) => {
    const blogs = selectBlogs(state);

    const blogsFiltered = applyFilters(blogs, [
      (blogs) => blogs.filter((blog) => !excludedIds?.includes(blog.id)),
      (blogs) => filterEntitiesByLanguage(blogs, languageId),
    ]);

    return blogsFiltered;
  }
);

export const selectBlogsByIdsAndLanguageId = createSelector(
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
    const blogs = selectBlogsByIds(state, ids);

    const found = blogs.flatMap((blog) => (blog ? [blog] : []));
    const numMissing = blogs.length - found.length;

    const valid = found.filter((blog) =>
      mapLanguageIds(blog.translations).includes(languageId)
    );
    const invalid = found.filter(
      (blog) => !mapLanguageIds(blog.translations).includes(languageId)
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
