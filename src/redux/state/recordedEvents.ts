import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/react";
import { v4 as generateUId } from "uuid";

import { recordedEventsApi } from "^redux/services/recordedEvents";
import { RootState } from "^redux/store";

import { createNewRecordedEvent } from "^data/documents/recordedEvents";

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
    overWriteOne(
      state,
      action: PayloadAction<{
        data: RecordedEvent;
      }>
    ) {
      const { data } = action.payload;
      recordedEventAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: RecordedEvent[];
      }>
    ) {
      const { data } = action.payload;
      recordedEventAdapter.setAll(state, data);
    },
    addOne(state) {
      const recordedEvent = createNewRecordedEvent({
        id: generateUId(),
        translationId: generateUId(),
      });

      recordedEventAdapter.addOne(state, recordedEvent);
    },
    removeOne(state, action: EntityPayloadAction) {
      const { id } = action.payload;

      recordedEventAdapter.removeOne(state, id);
    },
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
    updatePublishDate(
      state,
      action: EntityPayloadAction<{
        date: Date;
      }>
    ) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.publishInfo.date = date;
      }
    },
    togglePublishStatus(state, action: EntityPayloadAction) {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const currentStatus = entity.publishInfo.status;
        entity.publishInfo.status =
          currentStatus === "draft" ? "published" : "draft";
      }
    },
    updateSaveDate(
      state,
      action: EntityPayloadAction<{
        date: Date;
      }>
    ) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.lastSave = date;
      }
    },
    addTranslation(
      state,
      action: EntityPayloadAction<{
        languageId: string;
      }>
    ) {
      const { id, languageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.translations.push({
          id: generateUId(),
          languageId,
          body: null,
        });
      }
    },
    deleteTranslation(
      state,
      action: EntityPayloadAction<{
        translationId: string;
      }>
    ) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);

        translations.splice(index, 1);
      }
    },
    addSubject(
      state,
      action: EntityPayloadAction<{
        subjectId: string;
      }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.subjectIds.push(subjectId);
      }
    },
    removeSubject(
      state,
      action: EntityPayloadAction<{
        subjectId: string;
      }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const subjectIds = entity.subjectIds;
        const index = subjectIds.findIndex((tId) => tId === subjectId);
        subjectIds.splice(index, 1);
      }
    },
    addCollection(
      state,
      action: EntityPayloadAction<{
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.collectionIds.push(collectionId);
      }
    },
    removeCollection(
      state,
      action: EntityPayloadAction<{
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const collectionIds = entity.collectionIds;
        const index = collectionIds.findIndex((tId) => tId === collectionId);
        collectionIds.splice(index, 1);
      }
    },
    addAuthor(
      state,
      action: EntityPayloadAction<{
        authorId: string;
      }>
    ) {
      const { id, authorId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.authorIds.push(authorId);
      }
    },
    removeAuthor(
      state,
      action: EntityPayloadAction<{
        authorId: string;
      }>
    ) {
      const { id, authorId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const authorIds = entity.authorIds;
        const index = authorIds.findIndex((id) => id === authorId);

        authorIds.splice(index, 1);
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
    addTag(
      state,
      action: EntityPayloadAction<{
        tagId: string;
      }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.tagIds.push(tagId);
      }
    },
    removeTag(
      state,
      action: EntityPayloadAction<{
        tagId: string;
      }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const tagIds = entity.tagIds;
        const index = tagIds.findIndex((tId) => tId === tagId);
        tagIds.splice(index, 1);
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
        entity.summaryImage.imageId = imgId;
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
} = recordedEventsSlice.actions;

export const { selectAll, selectById, selectTotal } =
  recordedEventAdapter.getSelectors((state: RootState) => state.recordedEvents);
export const selectIds = (state: RootState) =>
  state.recordedEvents.ids as string[];
