import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
  nanoid,
  createSlice,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";
import { createCollection } from "^data/createDocument";

import { collectionsApi } from "^redux/services/collections";
import { RootState } from "^redux/store";

// import createDisplayContentGenericSlice from "./higher-order-reducers/displayContentGeneric";

import { Collection, CollectionTranslation } from "^types/collection";
import { EntityPayloadGeneric, TranslationPayloadGeneric } from "./types";

type Entity = Collection;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    undoOne: adapter.setOne,
    undoAll: adapter.setAll,
    addOne: {
      reducer(state, action: PayloadAction<Entity>) {
        const entity = action.payload;
        adapter.addOne(state, entity);
      },
      prepare(payload: { id?: string; title?: string; languageId?: string }) {
        return {
          payload: createCollection({
            id: payload.id || nanoid(),
            translationId: nanoid(),
            title: payload?.title || "",
            languageId: payload.languageId || undefined,
          }),
        };
      },
    },
    removeOne(state, action: PayloadAction<EntityPayloadGeneric>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    togglePublishStatus(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const currentStatus = entity.publishStatus;
        entity.publishStatus =
          currentStatus === "draft" ? "published" : "draft";
      }
    },
    updatePublishDate(
      state,
      action: PayloadAction<{ id: string; date: Date }>
    ) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.publishDate = date;
      }
    },
    updateSaveDate(state, action: PayloadAction<{ id: string; date: Date }>) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.lastSave = date;
      }
    },
    removeTranslation(
      state,
      action: PayloadAction<{
        id: string;
        translationId?: string;
        languageId?: string;
      }>
    ) {
      const { id, translationId, languageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;

        if (translationId) {
          const index = translations.findIndex((t) => t.id === translationId);
          translations.splice(index, 1);
        } else if (languageId) {
          const index = translations.findIndex(
            (t) => t.languageId === languageId
          );
          translations.splice(index, 1);
        }
      }
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
