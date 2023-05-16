import {
  ActionReducerMapBuilder,
  createSlice,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { Collection } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";
import { Subject } from "^types/subject";

type CuratedEntitySharedFields = {
  [k in keyof Article &
    keyof Blog &
    keyof RecordedEvent &
    keyof Collection &
    keyof Subject]:
    | Article[k]
    | Blog[k]
    | RecordedEvent[k]
    | Collection[k]
    | Subject[k];
};

export type CuratedEntity = Pick<
  CuratedEntitySharedFields,
  "id" | "lastSave" | "publishDate" | "publishStatus"
>;

export default function createCuratedEntityReducers<
  TEntity extends CuratedEntity,
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

          if (!entity.publishDate) {
            entity.publishDate = new Date();
          }
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
