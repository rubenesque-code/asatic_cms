import { PayloadAction, createEntityAdapter } from "@reduxjs/toolkit";

import { collectionsApi } from "^redux/services/collections";

import { Collection } from "^types/collection";
import { createDisplayContentGenericeSlice } from "./higher-order-reducers/displayContentGeneric";

const adapter = createEntityAdapter<Collection>();
const initialState = adapter.getInitialState();

const slice = createDisplayContentGenericeSlice({
  name: "collections",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Collection;
      }>
    ) {
      const { data } = action.payload;
      adapter.setOne(state, data);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      collectionsApi.endpoints.fetchCollections.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

export const {} = slice.actions;
