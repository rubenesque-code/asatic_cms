import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";
import { v4 as generateUId } from "uuid";

import { collectionsApi } from "^redux/services/collections";
import { RootState } from "^redux/store";

import { Collection, CollectionTranslation } from "^types/collection";
import { createDisplayEntitySlice } from "./higher-order-reducers";

const collectionAdapter = createEntityAdapter<Collection>();
const initialState = collectionAdapter.getInitialState();

const collectionsSlice = createDisplayEntitySlice({
  name: "collections",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Collection;
      }>
    ) {
      const { data } = action.payload;
      collectionAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Collection[];
      }>
    ) {
      const { data } = action.payload;
      collectionAdapter.setAll(state, data);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      collectionAdapter.removeOne(state, id);
    },
    addOne(
      state,
      action: PayloadAction<{
        id?: string;
        text: string;
        languageId: string;
      }>
    ) {
      const { id, languageId, text } = action.payload;

      const translation: CollectionTranslation = {
        id: generateUId(),
        languageId,
        label: text,
      };

      const collection: Collection = {
        id: id || generateUId(),
        translations: [translation],
        subjectsById: [],
        landing: {
          autoSection: {
            imgVertPosition: 50,
          },
        },
      };

      collectionAdapter.addOne(state, collection);
    },
    updateImageSrc(
      state,
      action: PayloadAction<{
        id: string;
        imageId: string;
      }>
    ) {
      const { id, imageId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      entity.imageId = imageId;
    },
    updateLandingAutoSectionImageVertPosition(
      state,
      action: PayloadAction<{ id: string; imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landing.autoSection.imgVertPosition = imgVertPosition;
      }
    },
    addSubject(
      state,
      action: PayloadAction<{
        id: string;
        subjectId: string;
      }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      entity.subjectsById.push(subjectId);
    },
    removeSubject(
      state,
      action: PayloadAction<{
        id: string;
        subjectId: string;
      }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const subjectsById = entity.subjectsById;
      const subjectIndex = subjectsById.findIndex((id) => id === subjectId);

      subjectsById.splice(subjectIndex, 1);
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        languageId: string;
        text?: string;
      }>
    ) {
      const { id, languageId, text } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const translation: CollectionTranslation = {
        id: generateUId(),
        languageId,
        label: text || "",
      };

      entity.translations.push(translation);
    },
    updateText(
      state,
      action: PayloadAction<{
        id: string;
        text: string;
        translationId: string;
      }>
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
      translation.label = text;
    },
    updateDescription(
      state,
      action: PayloadAction<{
        id: string;
        text: JSONContent;
        translationId: string;
      }>
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
      translation.description = text;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      collectionsApi.endpoints.fetchCollections.matchFulfilled,
      (state, { payload }) => {
        collectionAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default collectionsSlice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  addOne,
  removeOne,
  updateText,
  addTranslation,
  removeSubject,
  addSubject,
  updateDescription,
  updateImageSrc,
  updateLandingAutoSectionImageVertPosition,
} = collectionsSlice.actions;

export const { selectAll, selectById, selectTotal, selectEntities } =
  collectionAdapter.getSelectors((state: RootState) => state.collections);
export const selectIds = (state: RootState) =>
  state.collections.ids as string[];

export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.collections.entities;
  const selectedEntities = ids.map((id) => entities[id]);

  return selectedEntities;
};
