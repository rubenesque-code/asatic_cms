import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";

import { collectionsApi } from "^redux/services/collections";
import { RootState } from "^redux/store";

import createDisplayContentGenericSlice from "./higher-order-reducers/displayContentGeneric";

import { Collection } from "^types/collection";
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
    addOne(state, action: PayloadAction<Entity>) {
      adapter.addOne(state, action.payload);
    },
    removeOne(state, action: PayloadAction<EntityPayloadGeneric>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    updateImageSrc(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imageId: string }>
    ) {
      const { id, imageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.image = {
          ...entity.image,
          id: imageId,
        };
      }
    },
    updateImageVertPosition(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.image = {
          ...entity.image,
          vertPosition: imgVertPosition,
        };
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
      action: PayloadAction<
        TranslationPayloadGeneric & { description: JSONContent }
      >
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
  updateImageSrc,
  updateImageVertPosition,
  updateTitle,
  updatePublishDate,
  updateSaveDate,
} = slice.actions;

const {
  selectAll: selectCollections,
  selectById: selectCollectionById,
  selectIds,
  selectTotal: selectTotalCollections,
} = adapter.getSelectors((state: RootState) => state.collections);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectCollectionsIds = selectIds as unknown as SelectIdsAsserted;

export {
  selectCollections,
  selectCollectionById,
  selectCollectionsIds,
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
