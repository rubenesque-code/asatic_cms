import { PayloadAction, createEntityAdapter, nanoid } from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";
import { createCollection } from "^data/createDocument";

import { collectionsApi } from "^redux/services/collections";
import { RootState } from "^redux/store";

import { Collection } from "^types/collection";
import { createDisplayContentGenericSlice } from "./higher-order-reducers/displayContentGeneric";
import { EntityPayloadGeneric, TranslationPayloadGeneric } from "./types";

type Entity = Collection;
// type EntityTranslation = Collection["translations"][number];

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createDisplayContentGenericSlice({
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
      prepare() {
        return {
          payload: createCollection({
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
    updateImage(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imageId: string }>
    ) {
      const { id, imageId } = action.payload;
      adapter.updateOne(state, { id, changes: { imageId } });
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
    updateLabel(
      state,
      action: PayloadAction<TranslationPayloadGeneric & { label: string }>
    ) {
      const { id, label, translationId } = action.payload;
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
      translation.label = label;
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
  updateImage,
  updateLabel,
  updatePublishDate,
  updateSaveDate,
} = slice.actions;

export const { selectAll, selectById, selectTotal } = adapter.getSelectors(
  (state: RootState) => state.collections
);
export const selectIds = (state: RootState) =>
  state.collections.ids as string[];

export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.collections.entities;
  const selectedEntities = ids.map((id) => entities[id]);

  return selectedEntities;
};
