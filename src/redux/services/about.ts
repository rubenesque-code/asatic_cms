import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchAbout } from "^lib/firebase/firestore/fetch";
import { AboutPage } from "^types/about";

export const aboutApi = createApi({
  reducerPath: "aboutApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchAbout: build.query<AboutPage[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchAbout()) as AboutPage[] | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchAboutQuery } = aboutApi;
