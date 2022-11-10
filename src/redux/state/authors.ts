import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";
import { createAuthor } from "^data/createDocument";

import { authorsApi } from "^redux/services/authors";
import { RootState } from "^redux/store";

import { Author } from "^types/author";

const authorAdapter = createEntityAdapter<Author>();
const initialState = authorAdapter.getInitialState();

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Author;
      }>
    ) {
      const { data } = action.payload;
      authorAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Author[];
      }>
    ) {
      const { data } = action.payload;
      authorAdapter.setAll(state, data);
    },
    addOne(
      state,
      action: PayloadAction<{ id?: string; name?: string; languageId?: string }>
    ) {
      const { id, name, languageId } = action.payload;

      const author = createAuthor({
        id: id || generateUId(),
        name,
        languageId,
        translationId: generateUId(),
      });

      authorAdapter.addOne(state, author);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      authorAdapter.removeOne(state, id);
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
    updateName(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        translationId: string;
      }>
    ) {
      const { id, name, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.name = name;
        }
      }
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        languageId: string;
        name?: string;
      }>
    ) {
      const { id, languageId, name } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;

        translations.push({ id: generateUId(), languageId, name });
      }
    },
    removeTranslation(
      state,
      action: PayloadAction<{
        id: string;
        translationId: string;
      }>
    ) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);
        translations.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authorsApi.endpoints.fetchAuthors.matchFulfilled,
      (state, { payload }) => {
        authorAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default authorSlice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  removeOne,
  addOne,
  updateName,
  addTranslation,
  removeTranslation,
  addArticle,
  addBlog,
  addRecordedEvent,
  removeArticle,
  removeBlog,
  removeRecordedEvent,
} = authorSlice.actions;

const {
  selectAll: selectAuthors,
  selectById: selectAuthorById,
  selectIds,
  selectTotal: selectTotalAuthors,
} = authorAdapter.getSelectors((state: RootState) => state.authors);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectAuthorsIds = selectIds as unknown as SelectIdsAsserted;

const selectAuthorsByIds = createSelector(
  [selectAuthors, (_state: RootState, ids: string[]) => ids],
  (authors, ids) => ids.map((id) => authors.find((s) => s.id === id))
);

export {
  selectAuthors,
  selectAuthorById,
  selectTotalAuthors,
  selectAuthorsIds,
  selectAuthorsByIds,
};
