import {
  ActionReducerMapBuilder,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { ArticleLikeTranslation } from "^types/article-like-content";

import {
  SecondaryContentFields,
  TranslationGeneric,
} from "^types/display-content";

import createPrimaryContentGenericSlice, {
  PrimaryEntity,
} from "./primaryContentGeneric";

/* type PrimaryContentEntityGeneric = Expand<DisplayContentGeneric> &
  Expand<SecondaryContentFields>; */
export type ArticleLikeEntity<
  TTranslation extends TranslationGeneric & ArticleLikeTranslation
> = PrimaryEntity<TTranslation> & SecondaryContentFields;

export default function createArticleLikeContentGenericSlice<
  TTranslation extends TranslationGeneric & ArticleLikeTranslation,
  TEntity extends ArticleLikeEntity<TTranslation>,
  Reducers extends SliceCaseReducers<EntityState<TEntity>>
>({
  name = "",
  initialState,
  reducers,
  extraReducers,
}: {
  name: string;
  initialState: EntityState<TEntity>;
  reducers: ValidateSliceCaseReducers<EntityState<TEntity>, Reducers>;
  extraReducers: (
    builder: ActionReducerMapBuilder<EntityState<TEntity>>
  ) => void;
}) {
  return createPrimaryContentGenericSlice({
    name,
    initialState,
    reducers: {
      updateTitle(
        state,
        action: PayloadAction<{
          id: string;
          translationId: string;
          title: string;
        }>
      ) {
        const { id, title, translationId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const translations = entity.translations;
          const translation = translations.find((t) => t.id === translationId);
          if (translation) {
            translation.title = title;
          }
        }
      },
      ...reducers,
    },
    extraReducers,
  });
}

// export { createDisplayContentGenericSlice as createDisplayContentGenericeSlice };
