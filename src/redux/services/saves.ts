import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { batchWriteArticlesPage } from "^lib/firebase/firestore/write";

type ArticlesPageSave = Parameters<typeof batchWriteArticlesPage>[0];

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
  }),
});

export const { useSaveArticlesPageMutation } = savePageApi;
