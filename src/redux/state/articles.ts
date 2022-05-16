import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { DEFAULTLANGUAGEID } from "^constants/data";

import { articlesApi } from "^redux/services/articles";
import { RootState } from "^redux/store";

import { Article, ArticleTranslation } from "^types/article";

const articleAdapter = createEntityAdapter<Article>();
const initialState = articleAdapter.getInitialState();

// todo: could have undefined for many of article fields? (so whe)
// type EntityPayloadAction<T = void> = PayloadAction<T & { id: string }>;
// * below is hacky - duplicates id: string as a property.
type EntityPayloadAction<T = { id: string }> = PayloadAction<
  T & { id: string }
>;

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Article;
      }>
    ) {
      const { data } = action.payload;
      articleAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Article[];
      }>
    ) {
      const { data } = action.payload;
      articleAdapter.setAll(state, data);
    },
    addOne(state) {
      const translationId = generateUId();

      const translation: ArticleTranslation = {
        id: translationId,
        languageId: DEFAULTLANGUAGEID,
      };

      const article: Article = {
        // defaultTranslationId: translationId,
        id: generateUId(),
        publishInfo: {
          status: "draft",
        },
        tagIds: [],
        translations: [translation],
        type: "article",
      };

      articleAdapter.addOne(state, article);
    },
    removeOne(state, action: EntityPayloadAction) {
      const { id } = action.payload;
      articleAdapter.removeOne(state, id);
    },
    updateDate(
      state,
      action: EntityPayloadAction<{
        date: Date;
      }>
    ) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.publishInfo.date = date;
      }
    },
    addTranslation(
      state,
      action: EntityPayloadAction<{
        languageId: string;
      }>
    ) {
      const { id, languageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.translations.push({
          id: generateUId(),
          languageId,
        });
      }
    },
    deleteTranslation(
      state,
      action: EntityPayloadAction<{
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
    addAuthor(
      state,
      action: EntityPayloadAction<{
        authorId: string;
      }>
    ) {
      const { id, authorId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.authorId = authorId;
      }
    },
    removeAuthor(state, action: EntityPayloadAction) {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.authorId = null;
      }
    },
    updateTitle(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        title: string;
      }>
    ) {
      const { id, title, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.title = title;
        }
      }
    },
    updateBody(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        body: string;
      }>
    ) {
      const { id, body, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.body = body;
        }
      }
    },
    addTag(
      state,
      action: EntityPayloadAction<{
        tagId: string;
      }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.tagIds.push(tagId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      articlesApi.endpoints.fetchArticles.matchFulfilled,
      (state, { payload }) => {
        articleAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default articleSlice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  removeOne,
  addOne,
  updateDate,
  addTranslation,
  deleteTranslation,
  addAuthor,
  removeAuthor,
  updateTitle,
  updateBody,
  addTag,
} = articleSlice.actions;

export const { selectAll, selectById, selectTotal } =
  articleAdapter.getSelectors((state: RootState) => state.articles);
export const selectIds = (state: RootState) => state.articles.ids as string[];
