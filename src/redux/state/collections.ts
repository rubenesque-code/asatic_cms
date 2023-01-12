import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
  nanoid,
} from "@reduxjs/toolkit";
import { createCollection } from "^data/createDocument";

import { collectionsApi } from "^redux/services/collections";
import { RootState } from "^redux/store";

import createDisplayContentGenericSlice from "./higher-order-reducers/displayContentGeneric";

import { relatedEntityFieldMap } from "./utilities/reducers";

import { Collection, CollectionRelatedEntity } from "^types/collection";
import { EntityPayloadGeneric, TranslationPayloadGeneric } from "./types";

type Entity = Collection;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createDisplayContentGenericSlice({
  name: "collections",
  initialState,
  reducers: {
    undoOne: adapter.setOne,
    undoAll: adapter.setAll,
    addOne(
      state,
      action: PayloadAction<
        Exclude<Parameters<typeof createCollection>[0], void>
      > | void
    ) {
      const collection = createCollection(action?.payload);

      adapter.addOne(state, collection);
    },
    removeOne(state, action: PayloadAction<EntityPayloadGeneric>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        translation: {
          id?: string;
          languageId: string;
          title?: string;
          description?: string;
        };
      }>
    ) {
      const { id, translation } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.translations.push({
        id: translation.id || nanoid(),
        languageId: translation.languageId,
        description: translation.description,
        title: translation.title,
      });
    },
    updateBannerImageSrc(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imageId: string }>
    ) {
      const { id, imageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.bannerImage.imageId = imageId;
      }
    },
    updateBannerImageVertPosition(
      state,
      action: PayloadAction<EntityPayloadGeneric & { vertPosition: number }>
    ) {
      const { id, vertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.bannerImage.vertPosition = vertPosition;
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
    updateDescription(
      state,
      action: PayloadAction<TranslationPayloadGeneric & { description: string }>
    ) {
      const { id, description, translationId } = action.payload;
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
      translation.description = description;
    },
    updateSummaryText(
      state,
      action: PayloadAction<TranslationPayloadGeneric & { text: string }>
    ) {
      const { id, text, translationId } = action.payload;
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
      translation.summary = text;
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
          name: CollectionRelatedEntity;
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
      entity[fieldKey].push(relatedEntity.id);
    },
    removeRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntity: {
          name: CollectionRelatedEntity;
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
      collectionsApi.endpoints.fetchCollections.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      collectionsApi.endpoints.createCollection.matchFulfilled,
      (state, { payload }) => {
        adapter.addOne(state, payload.collection);
      }
    );
    builder.addMatcher(
      collectionsApi.endpoints.deleteCollection.matchFulfilled,
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
  updateDescription,
  updateTitle,
  updatePublishDate,
  updateSaveDate,
  updateBannerImageSrc,
  updateBannerImageVertPosition,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateSummaryText,
  addRelatedEntity,
  removeRelatedEntity,
} = slice.actions;

const {
  selectAll: selectCollections,
  selectById: selectCollectionById,
  selectIds,
  selectTotal: selectTotalCollections,
} = adapter.getSelectors((state: RootState) => state.collections);

export {
  selectCollections,
  selectCollectionById,
  selectIds as selectCollectionsIds,
  selectTotalCollections,
};

export const selectCollectionsByIds = createSelector(
  [selectCollections, (_state: RootState, ids: string[]) => ids],
  (collections, ids) => ids.map((id) => collections.find((c) => c.id === id))
);
