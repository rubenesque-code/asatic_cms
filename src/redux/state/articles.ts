import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
// import { v4 as generateUId } from "uuid";

import { articlesApi } from "^redux/services/articles";
import { RootState } from "^redux/store";

import { Article } from "^types/articles";

const articleAdapter = createEntityAdapter<Article>();
const initialState = articleAdapter.getInitialState();

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    overWrite(
      state,
      action: PayloadAction<{
        data: Article[];
      }>
    ) {
      const { data } = action.payload;
      articleAdapter.setAll(state, data);
    },
    // addOne(
    //   state,
    //   action: PayloadAction<{
    //     defaultTranslationId: string;
    //   }>
    // ) {
    //   const {defaultTranslationId} = action.payload
    //   articleAdapter.addOne(state, {
    //     id: generateUId(),
    //     defaultTranslationId,
    //   });
    // },
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

export const { overWrite, removeOne } = articleSlice.actions;

export const { selectAll, selectById } = articleAdapter.getSelectors(
  (state: RootState) => state.articles
);
