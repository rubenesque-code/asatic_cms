import { createSelector } from "@reduxjs/toolkit";
import {
  checkHasValidTranslation,
  checkIsValidTranslation,
} from "^helpers/author";

import { mapIds, mapLanguageIds } from "^helpers/general";
import { selectLanguagesByIds } from "^redux/state/languages";
import { RootState } from "^redux/store";
import { Author, AuthorAsChildStatus } from "^types/author";

import { selectAuthorsByIds } from "../../authors";

export const selectEntityAuthorsStatus = createSelector(
  [
    (state: RootState) => state,
    selectAuthorsByIds,
    (_state: RootState, _authorsIds: string[], entityLanguagesIds: string[]) =>
      entityLanguagesIds,
  ],
  (state, authors, entityLanguagesIds) => {
    const statusArr = authors.map((author) =>
      selectEntityAuthorStatus(state, author, entityLanguagesIds)
    );

    return statusArr;
  }
);

export const selectEntityAuthorStatus = createSelector(
  [
    (state: RootState) => state,
    (_state, author: Author | undefined) => author,
    (_state, _author: Author | undefined, parentEntityLanguageIds: string[]) =>
      parentEntityLanguageIds,
  ],
  (state, author, parentEntityLanguageIds): AuthorAsChildStatus => {
    if (!author) {
      return "undefined";
    }

    const relatedLanguages = selectLanguagesByIds(
      state,
      mapLanguageIds(author.translations)
    );
    const validRelatedLanguageIds = mapIds(
      relatedLanguages.flatMap((e) => (e ? [e] : []))
    );

    const hasValidTranslation = checkHasValidTranslation(
      author.translations,
      validRelatedLanguageIds
    );

    if (!hasValidTranslation) {
      return {
        status: "invalid",
        missingRequirements: ["no valid translation"],
      };
    }

    for (let i = 0; i < author.translations.length; i++) {
      const translation = author.translations[i];
      const isValidTranslation = checkIsValidTranslation(
        translation,
        parentEntityLanguageIds
      );
      if (!isValidTranslation) {
        return {
          status: "warning",
          warnings: ["missing translation for parent language"],
        };
      }
    }

    return "good";
  }
);
