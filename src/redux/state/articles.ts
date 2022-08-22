/* import { PayloadAction, createEntityAdapter } from "@reduxjs/toolkit";

import { articlesApi } from "^redux/services/articles";

import { Article } from "^types/article";
import { MyOmit } from "^types/utilities";
// import createPrimaryContentGenericSlice from "./higher-order-reducers/primaryContentGeneric";

type Entity = Article;

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createPrimaryContentGenericSlice({
  name: "articles",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Entity;
      }>
    ) {
      const { data } = action.payload;
      adapter.setOne(state, data);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      articlesApi.endpoints.fetchArticles.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

const actions = slice.actions;

// type ArticleActions = MyOmit<typeof actions >
 */
