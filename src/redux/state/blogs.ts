import {
  PayloadAction,
  createEntityAdapter,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";

import { blogsApi } from "^redux/services/blogs";

import { RootState } from "^redux/store";
import { Blog } from "^types/blog";
import { EntityPayloadGeneric, TranslationPayloadGeneric } from "./types";

import createArticleLikeContentGenericSlice from "./higher-order-reducers/articleLikeContentGeneric";

import { createBlog } from "^data/createDocument";
import { JSONContent } from "@tiptap/core";
import { default_language_Id } from "^constants/data";

type Entity = Blog;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createArticleLikeContentGenericSlice({
  name: "blogs",
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
          payload: createBlog({
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
    addTranslation(
      state,
      action: PayloadAction<EntityPayloadGeneric & { languageId?: string }>
    ) {
      const { id, languageId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.translations.push({
        body: [],
        id: nanoid(),
        languageId: languageId || default_language_Id,
      });
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
    updateLandingCustomSummary(
      state,
      action: PayloadAction<
        TranslationPayloadGeneric & {
          summary: JSONContent;
        }
      >
    ) {
      const { id, summary, translationId } = action.payload;
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
      translation.landingCustomSummary = summary;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      blogsApi.endpoints.fetchBlogs.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      blogsApi.endpoints.createBlog.matchFulfilled,
      (state, { payload }) => {
        adapter.addOne(state, payload.blog);
      }
    );
    builder.addMatcher(
      blogsApi.endpoints.deleteBlog.matchFulfilled,
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
  moveSection,
  togglePublishStatus,
  undoAll,
  undoOne,
  updateBodyImageAspectRatio,
  updateBodyImageCaption,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyText,
  updateBodyVideoCaption,
  updateBodyVideoSrc,
  updatePublishDate,
  updateSaveDate,
  updateTitle,
  updateCollectionSummary,
  updateLandingAutoSummary,
  toggleUseLandingImage,
  updateLandingCustomSectionImageAspectRatio,
  updateLandingCustomSectionImageVertPosition,
  updateLandingCustomSummary,
  updateLandingImageSrc,
} = slice.actions;

const {
  selectAll: selectBlogs,
  selectById: selectBlogById,
  selectIds,
  selectTotal: selectTotalBlogs,
} = adapter.getSelectors((state: RootState) => state.blogs);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectBlogsIds = selectIds as unknown as SelectIdsAsserted;

const selectBlogsByIds = createSelector(
  [selectBlogs, (_state: RootState, ids: string[]) => ids],
  (blogs, ids) => ids.map((id) => blogs.find((s) => s.id === id))
);

export {
  selectBlogs,
  selectBlogById,
  selectTotalBlogs,
  selectBlogsIds,
  selectBlogsByIds,
};
