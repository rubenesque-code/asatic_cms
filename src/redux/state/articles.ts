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
        sections: [],
      };

      const article: Article = {
        defaultTranslationId: translationId,
        id: generateUId(),
        publishInfo: {
          status: "draft",
        },
        tags: [],
        translations: [translation],
        type: "article",
      };

      articleAdapter.addOne(state, article);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      articleAdapter.removeOne(state, id);
    },
    updateDate(
      state,
      action: PayloadAction<{
        articleId: string;
        date: Date;
      }>
    ) {
      const { articleId, date } = action.payload;
      const entity = state.entities[articleId];
      if (entity) {
        entity.publishInfo.date = date;
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

export const { overWriteOne, overWriteAll, removeOne, addOne, updateDate } =
  articleSlice.actions;

export const { selectAll, selectById, selectTotal } =
  articleAdapter.getSelectors((state: RootState) => state.articles);
export const selectIds = (state: RootState) => state.articles.ids as string[];
