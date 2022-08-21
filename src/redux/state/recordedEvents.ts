import { PayloadAction, createEntityAdapter } from "@reduxjs/toolkit";

import { recordedEventsApi } from "^redux/services/recordedEvents";

import createPrimaryContentGenericSlice from "./higher-order-reducers/primaryContentGeneric";

import { RecordedEvent } from "^types/recordedEvent";

type Entity = RecordedEvent;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createPrimaryContentGenericSlice({
  name: "recordedEvents",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Entity;
      }>
    ) {
      const { data } = action.payload;
      adapter.setOne(state, data);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      recordedEventsApi.endpoints.fetchRecordedEvents.matchFulfilled,
      (state, { payload }) => {
        // todo: upsert not correct
        adapter.upsertMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

// const actions = slice.actions;
