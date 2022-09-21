import {
  PayloadAction,
  createEntityAdapter,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";

import { recordedEventsApi } from "^redux/services/recordedEvents";

import { RecordedEvent } from "^types/recordedEvent";
import { EntityPayloadGeneric, TranslationPayloadGeneric } from "./types";

import createPrimaryContentGenericSlice from "./higher-order-reducers/primaryContentGeneric";
import { RootState } from "^redux/store";
import { createRecordedEvent } from "^data/createDocument";

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
    updateLandingImageSrc(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imageId: string }>
    ) {
      const { id, imageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.imageId = imageId;
      }
    },
    updateLandingAutoSectionImageVertPosition(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.autoSection.imgVertPosition = imgVertPosition;
      }
    },
    updateLandingCustomSectionImageVertPosition(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.customSection.imgVertPosition = imgVertPosition;
      }
    },
    updateLandingCustomSectionImageAspectRatio(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imgAspectRatio: number }>
    ) {
      const { id, imgAspectRatio } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.customSection.imgAspectRatio = imgAspectRatio;
      }
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
  updateLandingAutoSectionImageVertPosition,
  updateLandingCustomSectionImageAspectRatio,
  updateLandingCustomSectionImageVertPosition,
  updateLandingImageSrc,
  updatePublishDate,
  updateSaveDate,
  updateTitle,
  updateVideoSrc,
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
