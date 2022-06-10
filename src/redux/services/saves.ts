import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
// import { toast } from "react-toastify";

import {
  batchWriteArticlesPage,
  batchWriteArticlePage,
} from "^lib/firebase/firestore/write";

type ArticlesPageSave = Parameters<typeof batchWriteArticlesPage>[0];
type ArticlePageSave = Parameters<typeof batchWriteArticlePage>[0];

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
          // await withToast(() => batchWriteArticlePage(data));
          await batchWriteArticlePage(data);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useSaveArticlesPageMutation, useSaveArticlePageMutation } =
  savePageApi;
