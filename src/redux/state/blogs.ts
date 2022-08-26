import { createEntityAdapter, nanoid, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { blogsApi } from "^redux/services/blogs";

import { Blog } from "^types/blog";

import createArticleLikeContentGenericSlice from "./higher-order-reducers/articleLikeContentGeneric";
import { createBlog } from "^data/createDocument";
import { EntityPayloadGeneric } from "./types";

type Entity = Blog;

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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      blogsApi.endpoints.fetchBlogs.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

export const {
  addAuthor,
  addBodySection,
  addCollection,
  addOne,
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
  undoOne,
  undoAll,
  updateBodyImageAspectRatio: udpateBodyImageAspectRatio,
  updateBodyImageCaption: udpateBodyImageCaption,
  updateBodyImageSrc: udpateBodyImageSrc,
  updateBodyImageVertPosition: udpateBodyImageVertPosition,
  updateBodyText: udpateBodyText,
  updateBodyVideoCaption: udpateBodyVideoCaption,
  updateBodyVideoSrc: udpateBodyVideoSrc,
  updatePublishDate,
  updateSaveDate,
  updateSummary,
  updateTitle,
} = slice.actions;

export const { selectAll, selectById, selectTotal } = adapter.getSelectors(
  (state: RootState) => state.blogs
);
export const selectIds = (state: RootState) => state.blogs.ids as string[];

export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.blogs.entities;
  const selectedEntities = ids.map((id) => entities[id]);

  return selectedEntities;
};
