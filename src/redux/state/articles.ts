import {
  PayloadAction,
  createEntityAdapter,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";

import { articlesApi } from "^redux/services/articles";

import { Article } from "^types/article";
import { EntityPayloadGeneric } from "./types";

import createArticleLikeContentGenericSlice from "./higher-order-reducers/articleLikeContentGeneric";
import { RootState } from "^redux/store";
import { createArticle } from "^data/createDocument";

type Entity = Article;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createArticleLikeContentGenericSlice({
  name: "articles",
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
          payload: createArticle({
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
    toggleUseLandingImage(state, action: PayloadAction<EntityPayloadGeneric>) {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.useImage = !entity.landingImage.useImage;
      }
    },
    updateLandingImageSrc(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imageId: string }>
    ) {
      const { id, imageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.imageId = imageId;
      }
    },
    updateLandingAutoSectionImageVertPosition(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.autoSection.imgVertPosition = imgVertPosition;
      }
    },
    updateLandingCustomSectionImageVertPosition(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imgVertPosition: number }>
    ) {
      const { id, imgVertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.customSection.imgVertPosition = imgVertPosition;
      }
    },
    updateLandingCustomSectionImageAspectRatio(
      state,
      action: PayloadAction<EntityPayloadGeneric & { imgAspectRatio: number }>
    ) {
      const { id, imgAspectRatio } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.landingImage.customSection.imgAspectRatio = imgAspectRatio;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      articlesApi.endpoints.fetchArticles.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      articlesApi.endpoints.createArticle.matchFulfilled,
      (state, { payload }) => {
        adapter.addOne(state, payload.article);
      }
    );
    builder.addMatcher(
      articlesApi.endpoints.deleteArticle.matchFulfilled,
      (state, { payload }) => {
        adapter.removeOne(state, payload.id);
      }
    );
  },
});

export default slice.reducer;

export const {
  addAuthor,
  addBodySection,
  addCollection,
  addSubject,
  addTag,
  addTranslation,
  removeAuthor,
  removeBodySection,
  removeCollection,
  removeOne,
  removeSubject,
  removeTag,
  removeTranslation,
  reorderBody,
  togglePublishStatus,
  toggleUseLandingImage,
  undoAll,
  undoOne,
  updateBodyImageAspectRatio,
  updateBodyImageCaption,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyText,
  updateBodyVideoCaption,
  updateBodyVideoSrc,
  updateLandingAutoSectionImageVertPosition,
  updateLandingCustomSectionImageAspectRatio,
  updateLandingCustomSectionImageVertPosition,
  updateLandingImageSrc,
  updatePublishDate,
  updateSaveDate,
  updateSummary,
  updateTitle,
} = slice.actions;

const {
  selectAll: selectArticles,
  selectById: selectArticleById,
  selectIds,
  selectTotal: selectTotalArticles,
} = adapter.getSelectors((state: RootState) => state.articles);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectArticlesIds = selectIds as unknown as SelectIdsAsserted;

const selectArticlesByIds = createSelector(
  [selectArticles, (_state: RootState, ids: string[]) => ids],
  (articles, ids) => ids.map((id) => articles.find((s) => s.id === id))
);

export {
  selectArticles,
  selectArticleById,
  selectTotalArticles,
  selectArticlesIds,
  selectArticlesByIds,
};
