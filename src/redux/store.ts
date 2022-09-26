import { configureStore } from "@reduxjs/toolkit";

import { articlesApi } from "./services/articles";
import articlesReducer from "./state/articles";
import { blogsApi } from "./services/blogs";
import blogsReducer from "./state/blogs";
import { recordedEventsApi } from "./services/recordedEvents";
import recordedEventsReducer from "./state/recordedEvents";
import { authorsApi } from "./services/authors";
import authorsReducer from "./state/authors";
import { tagsApi } from "./services/tags";
import tagsReducer from "./state/tags";
import { languagesApi } from "./services/languages";
import languagesReducer from "./state/languages";
import { savePageApi } from "./services/saves";
import imagesReducer from "./state/images";
import { imagesApi } from "./services/images";
import { imageKeywordsApi } from "./services/imageKeywords";
import { landingApi } from "./services/landing";
import landingReducer from "./state/landing";
import { subjectsApi } from "./services/subjects";
import subjectsReducer from "./state/subjects";
import { collectionsApi } from "./services/collections";
import collectionsReducer from "./state/collections";
import { deployApi } from "./services/deploy";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
    blogs: blogsReducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    authors: authorsReducer,
    [authorsApi.reducerPath]: authorsApi.reducer,
    tags: tagsReducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    languages: languagesReducer,
    [languagesApi.reducerPath]: languagesApi.reducer,
    [savePageApi.reducerPath]: savePageApi.reducer,
    images: imagesReducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
    [imageKeywordsApi.reducerPath]: imageKeywordsApi.reducer,
    landing: landingReducer,
    [landingApi.reducerPath]: landingApi.reducer,
    recordedEvents: recordedEventsReducer,
    [recordedEventsApi.reducerPath]: recordedEventsApi.reducer,
    subjects: subjectsReducer,
    [subjectsApi.reducerPath]: subjectsApi.reducer,
    [collectionsApi.reducerPath]: collectionsApi.reducer,
    collections: collectionsReducer,
    [deployApi.reducerPath]: deployApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      articlesApi.middleware,
      authorsApi.middleware,
      tagsApi.middleware,
      languagesApi.middleware,
      savePageApi.middleware,
      imagesApi.middleware,
      imageKeywordsApi.middleware,
      landingApi.middleware,
      recordedEventsApi.middleware,
      subjectsApi.middleware,
      collectionsApi.middleware,
      blogsApi.middleware,
      deployApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
