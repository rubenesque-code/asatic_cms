import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchArticles } from "^lib/firebase/firestore/fetch";
import { Article } from "^types/article";

type Articles = Article[];

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    /**
      fetchArticle: build.query<Article | null, string>({
        queryFn: async (id: string) => {
          try {
            const resData = (await fetchArticle(id)) as Article | undefined;
            const data = resData || null;
  
            return { data };
          } catch (error) {
            return { error: true };
          }
        },
      }),
*/
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
