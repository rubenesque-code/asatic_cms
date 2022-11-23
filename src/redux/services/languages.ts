import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchLanguages } from "^lib/firebase/firestore/fetch";
import { Language } from "^types/language";

export const languagesApi = createApi({
  reducerPath: "languagesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchLanguages: build.query<Language[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchLanguages()) as Language[] | undefined;
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
