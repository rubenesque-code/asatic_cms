import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";

import { applyFilters, fuzzySearch } from "^helpers/general";
import { selectTags } from "../tags";
import { Tag } from "^types/tag";

export const selectTagsByQuery = createSelector(
  [
    (state: RootState) => state,
    (_state: RootState, filters: { query: string }) => filters,
  ],
  (state, { query }) => {
    const tags = selectTags(state);

    const filtered = applyFilters(tags, [
      (tags) => filterTagsByQuery(tags, query),
    ]);

    return filtered;
  }
);

function filterTagsByQuery(tags: Tag[], query: string) {
  if (!query.length) {
    return tags;
  }

  const queryableTags = tags.map((tag) => {
    return {
      id: tag.id,
      name: tag.text,
    };
  });

  const entitiesMatchingQuery = fuzzySearch(["name"], queryableTags, query).map(
    (r) => {
      const entityId = r.item.id;
      const entity = tags.find((entity) => entity.id === entityId)!;

      return entity;
    }
  );

  return entitiesMatchingQuery;
}
