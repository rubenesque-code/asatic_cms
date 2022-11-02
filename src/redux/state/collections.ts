import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
  nanoid,
} from "@reduxjs/toolkit";
import { createCollection } from "^data/createDocument";

import { collectionsApi } from "^redux/services/collections";
import { RootState } from "^redux/store";

// import createDisplayContentGenericSlice from "./higher-order-reducers/displayContentGeneric";

import { Collection, CollectionTranslation } from "^types/collection";
import createDisplayContentGenericSlice from "./higher-order-reducers/displayContentGeneric";
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
      action: PayloadAction<Parameters<typeof createCollection>[0]>
    ) {
      const args = action.payload;
      const collection = createCollection(args);

      adapter.addOne(state, collection);
    },
    removeOne(state, action: PayloadAction<EntityPayloadGeneric>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    addRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntity: Collection["relatedEntities"][number];
      }>
    ) {
      const { id, relatedEntity } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.relatedEntities.push(relatedEntity);
    },
    removeRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntityId: string;
      }>
    ) {
      const { id, relatedEntityId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.relatedEntities.findIndex(
        (e) => e.entityId === relatedEntityId
      );
      entity.relatedEntities.splice(index, 1);
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        languageId: string;
        title?: string;
      }>
    ) {
      const { id, languageId, title } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const translation: CollectionTranslation = {
        id: nanoid(),
        languageId,
        title: title || "",
      };

      entity.translations.push(translation);
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
    addSubject(
      state,
      action: PayloadAction<EntityPayloadGeneric & { subjectId: string }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.subjectsIds.push(subjectId);
      }
    },
    removeSubject(
      state,
      action: PayloadAction<EntityPayloadGeneric & { subjectId: string }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const subjectsIds = entity.subjectsIds;
        const index = subjectsIds.findIndex((id) => id === subjectId);

        subjectsIds.splice(index, 1);
      }
    },
    addTag(
      state,
      action: PayloadAction<EntityPayloadGeneric & { tagId: string }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.subjectsIds.push(tagId);
      }
    },
    removeTag(
      state,
      action: PayloadAction<EntityPayloadGeneric & { tagId: string }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const tagsIds = entity.tagsIds;
        const index = tagsIds.findIndex((id) => id === tagId);

        tagsIds.splice(index, 1);
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
    updateLandingAutoSummary(
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
      translation.landingAutoSummary = text;
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
  addSubject,
  addTag,
  addTranslation,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  togglePublishStatus,
  undoAll,
  undoOne,
  updateDescription,
  updateTitle,
  updatePublishDate,
  updateSaveDate,
  toggleUseSummaryImage,
  updateBannerImageSrc,
  updateBannerImageVertPosition,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  updateLandingAutoSummary,
  addRelatedEntity: addRelatedEntityToCollection,
  removeRelatedEntity: removeRelatedEntityFromCollection,
} = slice.actions;

const {
  selectAll: selectCollections,
  selectById: selectCollectionById,
  selectIds,
  selectTotal: selectTotalCollections,
} = adapter.getSelectors((state: RootState) => state.collections);

/* type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectCollectionsIds = selectIds as unknown as SelectIdsAsserted; */

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
/* export const selectCollectionsByIds = (state: RootState, ids: string[]) => {
  const entities = state.collections.entities;
  const selectedEntities = ids.map((id) => entities[id]);

  return selectedEntities;
}; */
