import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";
import { v4 as generateUId } from "uuid";

import { default_language_Id } from "^constants/data";

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
        languageId: default_language_Id,
        body: [],
        landingPage: {},
      };

      const article: Article = {
        // defaultTranslationId: translationId,
        id: generateUId(),
        publishInfo: {
          status: "draft",
        },
        authorIds: [],
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
    updatePublishDate(
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
    togglePublishStatus(state, action: EntityPayloadAction) {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const currentStatus = entity.publishInfo.status;
        entity.publishInfo.status =
          currentStatus === "draft" ? "published" : "draft";
      }
    },
    updateSaveDate(
      state,
      action: EntityPayloadAction<{
        date: Date;
      }>
    ) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.lastSave = date;
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
          body: [],
          landingPage: {},
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
        entity.authorIds.push(authorId);
      }
    },
    removeAuthor(
      state,
      action: EntityPayloadAction<{
        authorId: string;
      }>
    ) {
      const { id, authorId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const authorIds = entity.authorIds;
        const index = authorIds.findIndex((id) => id === authorId);

        authorIds.splice(index, 1);
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
        body: JSONContent;
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
    updateSummary(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        summary: JSONContent;
        summaryType: "auto" | "custom";
      }>
    ) {
      const { id, summary, translationId, summaryType } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          if (summaryType === "auto") {
            translation.landingPage.autoSummary = summary;
          } else {
            translation.landingPage.userSummary = summary;
          }
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
    removeTag(
      state,
      action: EntityPayloadAction<{
        tagId: string;
      }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const tagIds = entity.tagIds;
        const index = tagIds.findIndex((tId) => tId === tagId);
        tagIds.splice(index, 1);
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
  updatePublishDate,
  togglePublishStatus,
  addTranslation,
  deleteTranslation,
  addAuthor,
  removeAuthor,
  updateTitle,
  updateBody,
  addTag,
  removeTag,
  updateSaveDate,
  updateSummary,
} = articleSlice.actions;

export const { selectAll, selectById, selectTotal } =
  articleAdapter.getSelectors((state: RootState) => state.articles);
export const selectIds = (state: RootState) => state.articles.ids as string[];
