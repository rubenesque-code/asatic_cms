import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
// import { toast } from "react-toastify";

import {
  batchWriteArticlesPage,
  batchWriteArticlePage,
  batchWriteImagesPage,
  batchWriteAuthorsPage,
  batchWriteLanguagesPage,
  batchWriteTagsPage,
} from "^lib/firebase/firestore/write";

type ArticlesPageSave = Parameters<typeof batchWriteArticlesPage>[0];
type ArticlePageSave = Parameters<typeof batchWriteArticlePage>[0];
type ImagesPageSave = Parameters<typeof batchWriteImagesPage>[0];
type AuthorsPageSave = Parameters<typeof batchWriteAuthorsPage>[0];
type LanguagesPageSave = Parameters<typeof batchWriteLanguagesPage>[0];
type TagsPageSave = Parameters<typeof batchWriteTagsPage>[0];

/* const withToast = async (saveFunc: () => Promise<void>) => {
  await toast.promise(saveFunc(), {
    pending: "Saving...",
    success: "Saved",
    error: "Save error. Please try again.",
  });

  return;
}; */

export const savePageApi = createApi({
  reducerPath: "savePageApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    saveArticlesPage: build.mutation<null, ArticlesPageSave>({
      queryFn: async (data) => {
        try {
          await batchWriteArticlesPage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
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
  }),
});

export const {
  useSaveArticlesPageMutation,
  useSaveArticlePageMutation,
  useSaveImagesPageMutation,
  useSaveAuthorsPageMutation,
  useSaveLanguagesPageMutation,
  useSaveTagsPageMutation,
} = savePageApi;
