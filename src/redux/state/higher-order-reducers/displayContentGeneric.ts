import {
  ActionReducerMapBuilder,
  createSlice,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { Publishable, TrackSave } from "^types/display-content";

export type DisplayContentGeneric = {
  id: string;
} & Publishable &
  TrackSave;

function createDisplayContentGenericSlice<
  TEntity extends DisplayContentGeneric,
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
      ...reducers,
    },
    extraReducers,
  });
}

export { createDisplayContentGenericSlice as createDisplayContentGenericeSlice };
