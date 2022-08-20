import {
  ActionReducerMapBuilder,
  createSlice,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import { PublishStatus } from "^types/editable_content";

type GenericState<
  T extends {
    publishInfo: {
      status: PublishStatus;
      date?: Date;
    };
  }
> = EntityState<T>;

export const createDisplayEntitySlice = <
  T extends {
    publishInfo: {
      status: PublishStatus;
      date?: Date;
    };
  },
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
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      togglePublishStatus(state, action: PayloadAction<{ id: string }>) {
        const { id } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const currentStatus = entity.publishInfo.status;
          entity.publishInfo.status =
            currentStatus === "draft" ? "published" : "draft";
        }
      },
      ...reducers,
    },
    extraReducers,
  });
};
