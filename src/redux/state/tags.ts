import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { tagsApi } from "^redux/services/tags";
import { RootState } from "^redux/store";

import { Tag, Tags } from "^types/tag";

const tagAdapter = createEntityAdapter<Tag>();
const initialState = tagAdapter.getInitialState();

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Tag;
      }>
    ) {
      const { data } = action.payload;
      tagAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Tags;
      }>
    ) {
      const { data } = action.payload;
      tagAdapter.setAll(state, data);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      tagAdapter.removeOne(state, id);
    },
    addOne(
      state,
      action: PayloadAction<{
        id?: string;
        text: string;
      }>
    ) {
      const { id, text } = action.payload;
      tagAdapter.addOne(state, {
        id: id || generateUId(),
        text,
        articlesIds: [],
        blogsIds: [],
        recordedEventsIds: [],
        collectionsIds: [],
        subjectsIds: [],
        type: "tag",
      });
    },
    updateText(
      state,
      action: PayloadAction<{
        id: string;
        text: string;
      }>
    ) {
      const { id, text } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.text = text;
      }
    },
    addArticle(
      state,
      action: PayloadAction<{
        id: string;
        articleId: string;
      }>
    ) {
      const { id, articleId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.articlesIds.push(articleId);
    },
    removeArticle(
      state,
      action: PayloadAction<{
        id: string;
        articleId: string;
      }>
    ) {
      const { id, articleId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.articlesIds.findIndex((id) => id === articleId);
      entity.articlesIds.splice(index, 1);
    },
    addBlog(
      state,
      action: PayloadAction<{
        id: string;
        blogId: string;
      }>
    ) {
      const { id, blogId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.blogsIds.push(blogId);
    },
    removeBlog(
      state,
      action: PayloadAction<{
        id: string;
        blogId: string;
      }>
    ) {
      const { id, blogId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.blogsIds.findIndex((id) => id === blogId);
      entity.blogsIds.splice(index, 1);
    },
    addCollection(
      state,
      action: PayloadAction<{
        id: string;
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.collectionsIds.push(collectionId);
    },
    removeCollection(
      state,
      action: PayloadAction<{
        id: string;
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.collectionsIds.findIndex(
        (id) => id === collectionId
      );
      entity.collectionsIds.splice(index, 1);
    },
    addRecordedEvent(
      state,
      action: PayloadAction<{
        id: string;
        recordedEventId: string;
      }>
    ) {
      const { id, recordedEventId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.recordedEventsIds.push(recordedEventId);
    },
    removeRecordedEvent(
      state,
      action: PayloadAction<{
        id: string;
        recordedEventId: string;
      }>
    ) {
      const { id, recordedEventId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.recordedEventsIds.findIndex(
        (id) => id === recordedEventId
      );
      entity.recordedEventsIds.splice(index, 1);
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

      entity.subjectsIds.push(subjectId);
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

      const index = entity.subjectsIds.findIndex((id) => id === subjectId);
      entity.subjectsIds.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      tagsApi.endpoints.fetchTags.matchFulfilled,
      (state, { payload }) => {
        tagAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default tagsSlice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  addOne,
  removeOne,
  updateText,
  addArticle,
  addBlog,
  addCollection,
  addRecordedEvent,
  addSubject,
  removeArticle,
  removeBlog,
  removeCollection,
  removeRecordedEvent,
  removeSubject,
} = tagsSlice.actions;

const {
  selectAll: selectTags,
  selectById: selectTagById,
  selectIds,
  selectTotal: selectTotalTags,
} = tagAdapter.getSelectors((state: RootState) => state.tags);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectTagsIds = selectIds as unknown as SelectIdsAsserted;

const selectTagsByIds = createSelector(
  [selectTags, (_state: RootState, ids: string[]) => ids],
  (tags, ids) => ids.map((id) => tags.find((s) => s.id === id))
);

export {
  selectTags,
  selectTagById,
  selectTotalTags,
  selectTagsIds,
  selectTagsByIds,
};
