import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchTags } from "^lib/firebase/firestore/fetch";
import { Tag } from "^types/tag";

type Tags = Tag[];

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchTags: build.query<Tags, void>({
      queryFn: async () => {
        try {
          console.log("fetching tags...");
          const resData = (await fetchTags()) as Tags | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchTagsQuery } = tagsApi;
