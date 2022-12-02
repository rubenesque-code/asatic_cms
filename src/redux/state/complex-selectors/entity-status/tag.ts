import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { Tag, TagAsChildStatus } from "^types/tag";

import { selectTagsByIds } from "../../tags";

export const selectEntityTagsStatus = createSelector(
  [(state: RootState) => state, selectTagsByIds],
  (state, tags) => {
    const statusArr = tags.map((tag) => selectTagAsChildStatus(state, tag));

    return statusArr;
  }
);

export const selectTagAsChildStatus = createSelector(
  [(_state, tag: Tag | undefined) => tag],
  (tag): TagAsChildStatus => {
    if (!tag) {
      return "undefined";
    }

    if (!tag.text) {
      return {
        status: "invalid",
        missingRequirements: ["missing name field"],
      };
    }

    return "good";
  }
);
