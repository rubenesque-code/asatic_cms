import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchAuthors } from "^lib/firebase/firestore/fetch";

import { Author } from "^types/author";

type Authors = Author[];

export const authorsApi = createApi({
  reducerPath: "authorsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchAuthors: build.query<Authors, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchAuthors()) as Authors | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchAuthorsQuery } = authorsApi;
