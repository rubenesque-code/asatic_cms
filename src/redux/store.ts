import { configureStore } from "@reduxjs/toolkit";

import { articlesApi } from "./services/articles";
import articlesReducer from "./state/articles";
import { tagsApi } from "./services/tags";
import tagsReducer from "./state/tags";
import { languagesApi } from "./services/languages";
import languagesReducer from "./state/languages";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
    tags: tagsReducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    languages: languagesReducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      articlesApi.middleware,
      tagsApi.middleware,
      languagesApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
