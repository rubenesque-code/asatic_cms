import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { articlesApi } from "^redux/services/articles";
import { RootState } from "^redux/store";

import { Article } from "^types/article";

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

      articleAdapter.addOne(state, {
        defaultTranslationId: translationId,
        lastSave: null,
        optionalComponents: {
          useAuthor: false,
        },
        publishInfo: {
          status: "draft",
          date: null,
        },
        summaryImage: {
          url: null,
        },
        tags: [],
        translations: [],
        id: generateUId(),
        type: "article",
      });
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

export const { overWriteOne, overWriteAll, removeOne } = articleSlice.actions;

export const { selectAll, selectById, selectTotal } =
  articleAdapter.getSelectors((state: RootState) => state.articles);
export const selectIds = (state: RootState) => state.articles.ids as string[];
