import {
  ActionReducerMapBuilder,
  createSlice,
  Draft,
  EntityState,
  nanoid,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import {
  Publishable,
  TrackSave,
  TranslationGeneric,
} from "^types/display-content";

export type DisplayEntity<TTranslation extends TranslationGeneric> = {
  id: string;
  translations: TTranslation[];
} & Publishable &
  TrackSave;

export default function createDisplayContentGenericSlice<
  TTranslation extends TranslationGeneric,
  TEntity extends DisplayEntity<TTranslation>,
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
  return createSlice({
    name,
    initialState,
    reducers: {
      togglePublishStatus(state, action: PayloadAction<{ id: string }>) {
        const { id } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const currentStatus = entity.publishStatus;
          entity.publishStatus =
            currentStatus === "draft" ? "published" : "draft";
        }
      },
      updatePublishDate(
        state,
        action: PayloadAction<{ id: string; date: Date }>
      ) {
        const { id, date } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.publishDate = date;
        }
      },
      updateSaveDate(state, action: PayloadAction<{ id: string; date: Date }>) {
        const { id, date } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.lastSave = date;
        }
      },
      addTranslation: {
        reducer(
          state,
          action: PayloadAction<{
            id: string;
            newTranslation: Draft<TTranslation>;
          }>
        ) {
          const { newTranslation, id } = action.payload;
          const entity = state.entities[id];
          if (entity) {
            entity.translations.push(newTranslation);
          }
        },
        prepare(payload: { languageId: string; id: string }) {
          const { id, languageId } = payload;
          return {
            payload: {
              id,
              newTranslation: {
                id: nanoid(),
                languageId,
              },
            },
          };
        },
      },
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
