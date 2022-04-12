import { configureStore } from "@reduxjs/toolkit";

import { articlesApi } from "./services/articles";
import articlesReducer from "./state/articles";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(articlesApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
