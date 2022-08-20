import {
  CaseReducer,
  createSlice,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { Collection } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";

export const togglePublishStatus: CaseReducer<
  EntityState<Article | Blog | Collection | RecordedEvent>,
  PayloadAction<{ id: string }>
> = (state, action) => {
  const { id } = action.payload;
  const entity = state.entities[id];
  if (entity) {
    const currentStatus = entity.publishInfo.status;
    entity.publishInfo.status =
      currentStatus === "draft" ? "published" : "draft";
  }
};

// when to use prepare within action creators
//
type GenericState<T extends { id: string; order: number }> = EntityState<T>;

export const createGenericSlice = <
  T extends { id: string; order: number },
  Reducers extends SliceCaseReducers<GenericState<T>>
>({
  name = "",
  initialState,
  reducers,
  extraReducers,
}: {
  name: string;
  initialState: GenericState<T>;
  reducers: ValidateSliceCaseReducers<GenericState<T>, Reducers>;
  extraReducers: (builder: ActionReducerMapBuilder<GenericState<T>>) => void;
  // extraReducers:  SliceCaseReducers<GenericState<T>>
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      addOne(state, action: PayloadAction<{ id: string }>) {
        const { id } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.order = entity.order + 1;
        }
      },
      ...reducers,
    },
    extraReducers,
  });
};
