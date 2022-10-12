import {
  PayloadAction,
  createEntityAdapter,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";

import { RootState } from "^redux/store";
import { recordedEventsApi } from "^redux/services/recordedEvents";

import { createRecordedEvent } from "^data/createDocument";

import { default_language_Id } from "^constants/data";

import { RecordedEvent } from "^types/recordedEvent";
import { EntityPayloadGeneric, TranslationPayloadGeneric } from "./types";

import createPrimaryContentGenericSlice from "./higher-order-reducers/primaryContentGeneric";

type Entity = RecordedEvent;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createPrimaryContentGenericSlice({
  name: "recordedEvents",
  initialState,
  reducers: {
    undoOne: adapter.setOne,
    undoAll: adapter.setAll,
    addOne: {
      reducer(state, action: PayloadAction<Entity>) {
        const entity = action.payload;
        adapter.addOne(state, entity);
      },
      prepare() {
        return {
          payload: createRecordedEvent({
            id: nanoid(),
            translationId: nanoid(),
          }),
        };
      },
    },
    removeOne(state, action: PayloadAction<EntityPayloadGeneric>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    updateVideoSrc(
      state,
      action: PayloadAction<EntityPayloadGeneric & { youtubeId: string }>
    ) {
      const { id, youtubeId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.youtubeId = youtubeId;
      }
    },
    updateType(
      state,
      action: PayloadAction<EntityPayloadGeneric & { typeId: string }>
    ) {
      const { id, typeId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.recordedEventTypeId = typeId;
      }
    },
    addTranslation(
      state,
      action: PayloadAction<EntityPayloadGeneric & { languageId?: string }>
    ) {
      const { id, languageId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.translations.push({
        id: nanoid(),
        languageId: languageId || default_language_Id,
      });
    },
    updateTitle(
      state,
      action: PayloadAction<TranslationPayloadGeneric & { title: string }>
    ) {
      const { id, title, translationId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = entity.translations.find(
        (t) => t.id === translationId
      );
      if (!translation) {
        return;
      }
      translation.title = title;
    },
    updateBody(
      state,
      action: PayloadAction<TranslationPayloadGeneric & { body: JSONContent }>
    ) {
      const { id, body, translationId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = entity.translations.find(
        (t) => t.id === translationId
      );
      if (!translation) {
        return;
      }
      translation.body = body;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      recordedEventsApi.endpoints.fetchRecordedEvents.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      recordedEventsApi.endpoints.createRecordedEvent.matchFulfilled,
      (state, { payload }) => {
        adapter.addOne(state, payload.recordedEvent);
      }
    );
    builder.addMatcher(
      recordedEventsApi.endpoints.deleteRecordedEvent.matchFulfilled,
      (state, { payload }) => {
        adapter.removeOne(state, payload.id);
      }
    );
  },
});

export default slice.reducer;

export const {
  addAuthor,
  addCollection,
  addOne,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeCollection,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  togglePublishStatus,
  undoAll,
  undoOne,
  updateBody,
  updatePublishDate,
  updateSaveDate,
  updateTitle,
  updateVideoSrc,
  updateLandingCustomImageAspectRatio,
  updateLandingCustomImageVertPosition,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateType,
} = slice.actions;

const {
  selectAll: selectRecordedEvents,
  selectById: selectRecordedEventById,
  selectIds,
  selectTotal: selectTotalRecordedEvents,
} = adapter.getSelectors((state: RootState) => state.recordedEvents);

/* type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectRecordedEventsIds = selectIds as unknown as SelectIdsAsserted; */

const selectRecordedEventsByIds = createSelector(
  [selectRecordedEvents, (_state: RootState, ids: string[]) => ids],
  (recordedEvents, ids) =>
    ids.map((id) => recordedEvents.find((s) => s.id === id))
);

export {
  selectRecordedEvents,
  selectRecordedEventById,
  selectTotalRecordedEvents,
  selectIds as selectRecordedEventsIds,
  selectRecordedEventsByIds,
};
