import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchLanguages } from "^lib/firebase/firestore/fetch";
import { Languages } from "^types/language";

export const languagesApi = createApi({
  reducerPath: "languagesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchLanguages: build.query<Languages, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchLanguages()) as Languages | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchLanguagesQuery } = languagesApi;
