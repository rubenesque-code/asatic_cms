import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/react";
import { v4 as generateUId } from "uuid";

import { recordedEventsApi } from "^redux/services/recordedEvents";
import { RootState } from "^redux/store";

import { createNewRecordedEvent } from "^data/createDocument";

import { RecordedEvent } from "^types/recordedEvent";

const recordedEventAdapter = createEntityAdapter<RecordedEvent>();
const initialState = recordedEventAdapter.getInitialState();

type EntityPayloadAction<T = { id: string }> = PayloadAction<
  T & { id: string }
>;

const recordedEventsSlice = createSlice({
  name: "recordedEvents",
  initialState,
  reducers: {
    updateVideoSrc(
      state,
      action: EntityPayloadAction<{
        youtubeId: string;
      }>
    ) {
      const { id, youtubeId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.video = {
          id: entity.video?.id || generateUId(),
          video: {
            id: youtubeId,
            type: "youtube",
          },
        };
      }
    },
    updateTitle(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        title: string;
      }>
    ) {
      const { id, title, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.title = title;
        }
      }
    },
    updateBody(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        body: JSONContent;
      }>
    ) {
      const { id, body, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.body = body;
        }
      }
    },
    updateSummaryImageSrc(
      state,
      action: EntityPayloadAction<{
        imgId: string;
      }>
    ) {
      const { id, imgId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landing.imageId = imgId;
      }
    },
    updateLandingImageSrc(
      state,
      action: EntityPayloadAction<{ imageId: string }>
    ) {
      const { id, imageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landing.imageId = imageId;
      }
    },
    updateLandingAutoSectionImageVertPosition(
      state,
      action: EntityPayloadAction<{ imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landing.autoSection.imgVertPosition = imgVertPosition;
      }
    },
    updateLandingCustomSectionImageVertPosition(
      state,
      action: EntityPayloadAction<{ imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landing.customSection.imgVertPosition = imgVertPosition;
      }
    },
    updateLandingCustomSectionImageAspectRatio(
      state,
      action: EntityPayloadAction<{ imgAspectRatio: number }>
    ) {
      const { id, imgAspectRatio } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landing.customSection.imgAspectRatio = imgAspectRatio;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      recordedEventsApi.endpoints.fetchRecordedEvents.matchFulfilled,
      (state, { payload }) => {
        recordedEventAdapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      recordedEventsApi.endpoints.createRecordedEvent.matchFulfilled,
      (state, { payload }) => {
        recordedEventAdapter.addOne(state, payload.recordedEvent);
      }
    );
    builder.addMatcher(
      recordedEventsApi.endpoints.deleteRecordedEvent.matchFulfilled,
      (state, { payload }) => {
        recordedEventAdapter.removeOne(state, payload.id);
      }
    );
  },
});

export default recordedEventsSlice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  removeOne,
  addOne,
  updatePublishDate,
  togglePublishStatus,
  addTranslation,
  deleteTranslation,
  addAuthor,
  removeAuthor,
  updateTitle,
  addTag,
  removeTag,
  updateSaveDate,
  updateSummaryImageSrc,
  addSubject,
  removeSubject,
  addCollection,
  removeCollection,
  updateBody,
  updateVideoSrc,
  updateLandingAutoSectionImageVertPosition,
  updateLandingCustomSectionImageAspectRatio,
  updateLandingCustomSectionImageVertPosition,
  updateLandingImageSrc,
} = recordedEventsSlice.actions;

export const { selectAll, selectById, selectTotal } =
  recordedEventAdapter.getSelectors((state: RootState) => state.recordedEvents);
export const selectIds = (state: RootState) =>
  state.recordedEvents.ids as string[];
