import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchArticles } from "^lib/firebase/firestore/fetch";
import { Article } from "^types/article";

type Articles = Article[];

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchArticles: build.query<Articles, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchArticles()) as Articles | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchArticlesQuery } = articlesApi;
