import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
// import { toast } from "react-toastify";

import {
  batchWriteArticlePage,
  batchWriteBlogPage,
  batchWriteImagesPage,
  batchWriteAuthorsPage,
  batchWriteLanguagesPage,
  batchWriteTagsPage,
  batchWriteLandingPage,
  batchWriteRecordedEventPage,
} from "^lib/firebase/firestore/write/batchWritePages";

type ArticlePageSave = Parameters<typeof batchWriteArticlePage>[0];
type BlogPageSave = Parameters<typeof batchWriteBlogPage>[0];
type RecordedEventPageSave = Parameters<typeof batchWriteRecordedEventPage>[0];
type ImagesPageSave = Parameters<typeof batchWriteImagesPage>[0];
type AuthorsPageSave = Parameters<typeof batchWriteAuthorsPage>[0];
type LanguagesPageSave = Parameters<typeof batchWriteLanguagesPage>[0];
type TagsPageSave = Parameters<typeof batchWriteTagsPage>[0];
type LandingPageSave = Parameters<typeof batchWriteLandingPage>[0];

export const savePageApi = createApi({
  reducerPath: "savePageApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    saveArticlePage: build.mutation<null, ArticlePageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteArticlePage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    saveBlogPage: build.mutation<null, BlogPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteBlogPage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    saveRecordedEventPage: build.mutation<null, RecordedEventPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteRecordedEventPage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    saveImagesPage: build.mutation<null, ImagesPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteImagesPage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    saveAuthorsPage: build.mutation<null, AuthorsPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteAuthorsPage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    saveLanguagesPage: build.mutation<null, LanguagesPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteLanguagesPage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    saveTagsPage: build.mutation<null, TagsPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteTagsPage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    saveLandingPage: build.mutation<null, LandingPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteLandingPage(data);

          return { data: null };
        } catch (error) {
          console.log("error:", error);
          return { error: true };
        }
      },
    }),
  }),
});

export const {
  useSaveArticlePageMutation,
  useSaveBlogPageMutation,
  useSaveRecordedEventPageMutation,
  useSaveImagesPageMutation,
  useSaveAuthorsPageMutation,
  useSaveLanguagesPageMutation,
  useSaveTagsPageMutation,
  useSaveLandingPageMutation,
} = savePageApi;
