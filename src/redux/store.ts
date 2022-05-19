import { configureStore } from "@reduxjs/toolkit";

import { articlesApi } from "./services/articles";
import articlesReducer from "./state/articles";
import { authorsApi } from "./services/authors";
import authorsReducer from "./state/authors";
import { tagsApi } from "./services/tags";
import tagsReducer from "./state/tags";
import { languagesApi } from "./services/languages";
import languagesReducer from "./state/languages";
import { savePageApi } from "./services/saves";
import imagesReducer from "./state/images";
import { imagesApi } from "./services/images";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
    authors: authorsReducer,
    [authorsApi.reducerPath]: authorsApi.reducer,
    tags: tagsReducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    languages: languagesReducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
    [savePageApi.reducerPath]: savePageApi.reducer,
    images: imagesReducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      articlesApi.middleware,
      authorsApi.middleware,
      tagsApi.middleware,
      languagesApi.middleware,
      savePageApi.middleware,
      imagesApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
