import {
  PayloadAction,
  createEntityAdapter,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { recordedEventsApi } from "^redux/services/recordedEvents";

import { createRecordedEvent } from "^data/createDocument";

import { default_language_Id } from "^constants/data";

import {
  RecordedEvent,
  RecordedEventRelatedEntity,
} from "^types/recordedEvent";
import { EntityPayloadGeneric, TranslationPayloadGeneric } from "./types";

import createDocumentEntityReducers from "./higher-order-reducers/documentEntityReducers";
import { relatedEntityFieldMap } from "./utilities/reducers";

type Entity = RecordedEvent;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createDocumentEntityReducers({
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
          payload: createRecordedEvent(),
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
      action: PayloadAction<EntityPayloadGeneric & { typeId: string | null }>
    ) {
      const { id, typeId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.recordedEventTypeId = typeId;
      }
    },
    addTranslation(
      state,
      action: PayloadAction<
        EntityPayloadGeneric & { translation: { languageId?: string } }
      >
    ) {
      const { id, translation } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.translations.push({
        id: nanoid(),
        languageId: translation.languageId || default_language_Id,
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
      action: PayloadAction<TranslationPayloadGeneric & { body: string }>
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
    updateSummaryImageSrc(
      state,
      action: PayloadAction<{
        id: string;
        imageId: string;
      }>
    ) {
      const { id, imageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.summaryImage.imageId = imageId;
      }
    },
    updateSummaryImageVertPosition(
      state,
      action: PayloadAction<{
        id: string;
        vertPosition: number;
      }>
    ) {
      const { id, vertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.summaryImage.vertPosition = vertPosition;
      }
    },
    addRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntity: {
          name: RecordedEventRelatedEntity;
          id: string;
        };
      }>
    ) {
      const { id, relatedEntity } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const fieldKey = relatedEntityFieldMap[relatedEntity.name];
      if (fieldKey === "recordedEventTypeId") {
        entity[fieldKey] = relatedEntity.id;
      } else {
        entity[fieldKey].push(relatedEntity.id);
      }
    },
    removeRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntity: {
          name: Exclude<RecordedEventRelatedEntity, "recordedEventType">;
          id: string;
        };
      }>
    ) {
      const { id, relatedEntity } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const fieldKey = relatedEntityFieldMap[relatedEntity.name];
      const index = entity[fieldKey].findIndex((id) => id === relatedEntity.id);
      entity[fieldKey].splice(index, 1);
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
  addOne,
  addTranslation,
  removeOne,
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
  addRelatedEntity,
  removeRelatedEntity,
} = slice.actions;

const {
  selectAll: selectRecordedEvents,
  selectById: selectRecordedEventById,
  selectIds,
  selectTotal: selectTotalRecordedEvents,
} = adapter.getSelectors((state: RootState) => state.recordedEvents);

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
