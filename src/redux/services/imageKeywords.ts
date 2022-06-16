import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchImageKeywords } from "^lib/firebase/firestore/fetch";
import { ImageKeywords } from "^types/image";

export const imageKeywordsApi = createApi({
  reducerPath: "imageKeywordsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchImageKeywords: build.query<ImageKeywords, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchImageKeywords()) as
            | ImageKeywords
            | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchImageKeywordsQuery } = imageKeywordsApi;
