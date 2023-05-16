import {
  ActionReducerMapBuilder,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import {
  TranslationField,
  TranslationGlobalFields,
} from "^types/entity-translation";

import createCuratedEntityReducers, {
  CuratedEntity,
} from "./curatedEntityReducers";

type DocumentEntity<TTranslation extends TranslationGlobalFields> =
  CuratedEntity & { translations: TTranslation[] };

export default function createDocumentEntityReducers<
  TTranslation extends TranslationField<"id" | "languageId">,
  TEntity extends DocumentEntity<TTranslation>,
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
  return createCuratedEntityReducers({
    name,
    initialState,
    reducers: {
      removeTranslation(
        state,
        action: PayloadAction<{
          id: string;
          translationId?: string;
          languageId?: string;
        }>
      ) {
        const { id, translationId, languageId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const translations = entity.translations;

          if (translationId) {
            const index = translations.findIndex((t) => t.id === translationId);
            translations.splice(index, 1);
          } else if (languageId) {
            const index = translations.findIndex(
              (t) => t.languageId === languageId
            );
            translations.splice(index, 1);
          }
        }
      },
      ...reducers,
    },
    extraReducers,
  });
}
