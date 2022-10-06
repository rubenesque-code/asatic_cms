import { createSelector } from "@reduxjs/toolkit";
import { applyFilters } from "^helpers/general";

import { RootState } from "^redux/store";
import { selectBlogs } from "../blogs";

import {
  filterEntitiesByLanguage,
  filterPrimaryEntitiesByQuery,
} from "./helpers";

export const selectBlogsByLanguageAndQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { languageId: string; query: string }) =>
      filters,
  ],
  (state, { languageId, query }) => {
    const blogs = selectBlogs(state);

    const blogsFiltered = applyFilters(blogs, [
      (blogs) => filterEntitiesByLanguage(blogs, languageId),
      (blogs) => filterPrimaryEntitiesByQuery(state, blogs, query),
    ]);

    return blogsFiltered;
  }
);
