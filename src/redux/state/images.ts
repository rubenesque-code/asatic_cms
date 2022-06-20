import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { imagesApi } from "^redux/services/images";
import { RootState } from "^redux/store";

import { Image } from "^types/image";

const imageAdapter = createEntityAdapter<Image>();
const initialState = imageAdapter.getInitialState();

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    addOne(
      state,
      action: PayloadAction<{
        image: Image;
      }>
    ) {
      const { image } = action.payload;
      imageAdapter.addOne(state, image);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      imageAdapter.removeOne(state, id);
    },
    addArticleRelation(
      state,
      action: PayloadAction<{
        articleId: string;
        id: string;
      }>
    ) {
      const { articleId, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const relatedArticleIds = entity.relatedArticleIds;
        if (relatedArticleIds) {
          relatedArticleIds.push(articleId);
        } else {
          entity.relatedArticleIds = [articleId];
        }
      }
    },
    removeArticleRelation(
      state,
      action: PayloadAction<{
        articleId: string;
        id: string;
      }>
    ) {
      const { articleId, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const relatedArticleIds = entity.relatedArticleIds!;
        const index = relatedArticleIds.findIndex((id) => id === articleId);
        relatedArticleIds.splice(index, 1);
      }
    },
    addKeyword(
      state,
      action: PayloadAction<{
        id: string;
        keywordText: string;
      }>
    ) {
      const { keywordText, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const keyword = {
          id: generateUId(),
          text: keywordText,
        };
        entity.keywords.push(keyword);
      }
    },
    removeKeyword(
      state,
      action: PayloadAction<{
        id: string;
        keywordId: string;
      }>
    ) {
      const { keywordId, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const keywords = entity.keywords;
        const index = keywords.findIndex((k) => k.id === keywordId);
        keywords.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      imagesApi.endpoints.fetchImages.matchFulfilled,
      (state, { payload }) => {
        imageAdapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      imagesApi.endpoints.uploadImageAndCreateImageDoc.matchFulfilled,
      (state, { payload }) => {
        imageAdapter.addOne(state, payload);
      }
    );
    builder.addMatcher(
      imagesApi.endpoints.deleteUploadedImage.matchFulfilled,
      (state, { payload }) => {
        imageAdapter.removeOne(state, payload);
      }
    );
  },
});

export default imagesSlice.reducer;

export const {
  removeOne,
  addArticleRelation,
  removeArticleRelation,
  addKeyword,
  removeKeyword,
} = imagesSlice.actions;

export const { selectAll, selectById, selectTotal, selectEntities } =
  imageAdapter.getSelectors((state: RootState) => state.images);
export const selectIds = (state: RootState) => state.tags.ids as string[];
export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.images.entities;
  const entityArr = Object.values(entities) as Image[];
  const selectedEntities = entityArr.filter((tag) => ids.includes(tag.id));
  return selectedEntities;
};
