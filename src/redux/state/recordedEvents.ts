import { PayloadAction, createEntityAdapter, nanoid } from "@reduxjs/toolkit";

import { recordedEventsApi } from "^redux/services/recordedEvents";

import createPrimaryContentGenericSlice from "./higher-order-reducers/primaryContentGeneric";

import { RecordedEvent } from "^types/recordedEvent";
import { createNewRecordedEvent } from "^data/createDocument";

type Entity = RecordedEvent;
type EntityTranslation = RecordedEvent["translations"][number];

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createPrimaryContentGenericSlice({
  name: "recordedEvents",
  initialState,
  reducers: {
    // undoOne, undoAll + removeONe can use adapter utilities
    undoOne(
      state,
      action: PayloadAction<{
        data: Entity;
      }>
    ) {
      const { data } = action.payload;
      adapter.setOne(state, data);
    },
    undoAll(
      state,
      action: PayloadAction<{
        data: Entity[];
      }>
    ) {
      const { data } = action.payload;
      adapter.setAll(state, data);
    },
    addOne: {
      reducer(state, action: PayloadAction<Entity>) {
        const entity = action.payload;
        adapter.addOne(state, entity);
      },
      prepare() {
        return {
          payload: createNewRecordedEvent({
            id: nanoid(),
            translationId: nanoid(),
          }),
        };
      },
    },
    removeOne(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    addTranslation: {
      reducer(
        state,
        action: PayloadAction<{ id: string; newTranslation: EntityTranslation }>
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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      recordedEventsApi.endpoints.fetchRecordedEvents.matchFulfilled,
      (state, { payload }) => {
        // todo: upsert not correct
        adapter.addMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

// const actions = slice.actions;
