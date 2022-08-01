import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchCollections } from "^lib/firebase/firestore/fetch";
import { Collection } from "^types/collection";

export const collectionsApi = createApi({
  reducerPath: "collectionsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchCollections: build.query<Collection[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchCollections()) as
            | Collection[]
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

export const { useFetchCollectionsQuery } = collectionsApi;
