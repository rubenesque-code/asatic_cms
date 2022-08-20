import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";
import { v4 as generateUId } from "uuid";

import { collectionsApi } from "^redux/services/collections";
import { RootState } from "^redux/store";

import { Collection, CollectionTranslation } from "^types/collection";
import { createDisplayEntitySlice } from "./higher-order-reducers";

const adapter = createEntityAdapter<Collection>();
const initialState = adapter.getInitialState();

const slice = createDisplayEntitySlice({
  name: "collections",
  initialState,
  reducers: {},
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
