import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchLanding } from "^lib/firebase/firestore/fetch";
import { LandingSection } from "^types/landing";

export const landingApi = createApi({
  reducerPath: "landingApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchLanding: build.query<LandingSection[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchLanding()) as
            | LandingSection[]
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

export const { useFetchLandingQuery } = landingApi;
