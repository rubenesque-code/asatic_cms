import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { default_language_Id } from "^constants/data";

import { recordedEventsApi } from "^redux/services/recordedEvents";
import { RootState } from "^redux/store";

import { RecordedEvent, RecordedEventTranslation } from "^types/recordedEvent";

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
      const translationId = generateUId();

      const translation: RecordedEventTranslation = {
        id: translationId,
        languageId: default_language_Id,
        body: [],
      };

      const recordedEvent: RecordedEvent = {
        id: generateUId(),
        publishInfo: {
          status: "draft",
        },
        authorIds: [],
        subjectIds: [],
        tagIds: [],
        translations: [translation],
        type: "article",
        summaryImage: {},
      };

      recordedEventAdapter.addOne(state, recordedEvent);
    },
    removeOne(state, action: EntityPayloadAction) {
      const { id } = action.payload;

      recordedEventAdapter.removeOne(state, id);
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
          body: [],
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
} = recordedEventsSlice.actions;

export const { selectAll, selectById, selectTotal } =
  recordedEventAdapter.getSelectors((state: RootState) => state.recordedEvents);
export const selectIds = (state: RootState) =>
  state.recordedEvents.ids as string[];
