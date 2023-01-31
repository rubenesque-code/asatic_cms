import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { blogsApi } from "^redux/services/blogs";

import { createBlog } from "^data/createDocument";

import { Blog } from "^types/blog";
import { EntityPayloadGeneric } from "./types";

import createArticleLikeEntityReducers from "./higher-order-reducers/articleLikeEntityReducers";

type Entity = Blog;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createArticleLikeEntityReducers({
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
          payload: createBlog(),
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
  addBodySection,
  addTranslation,
  removeBodySection,
  removeOne,
  moveSection,
  togglePublishStatus,
  undoAll,
  undoOne,
  updateBodyImageCaption,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyText,
  updateBodyVideoCaption,
  updateBodyVideoSrc,
  updatePublishDate,
  updateSaveDate,
  updateTitle,
  updateSummary,
  addOne: addBlog,
  toggleUseSummaryImage,
  updateSummaryImageSrc,
  updateSummaryImageVertPosition,
  addRelatedEntity,
  removeRelatedEntity,
  removeTranslation,
  addTableColumn,
  addTableRow,
  deleteTableColumn,
  deleteTableRow,
  updateTableCellText,
  updateTableHeaderText,
  updateTableNotes,
  updateTableTitle,
  toggleTableCol1IsTitular,
  addFootnote,
  deleteFootnote,
  updateFootnoteNumber,
  updateFootnoteText,
} = slice.actions;

const {
  selectAll: selectBlogs,
  selectById: selectBlogById,
  selectIds: selectBlogsIds,
  selectTotal: selectTotalBlogs,
} = adapter.getSelectors((state: RootState) => state.blogs);

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
