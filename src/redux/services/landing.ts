import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchLanding } from "^lib/firebase/firestore/fetch";
import { LandingCustomSectionComponent } from "^types/landing";

export const landingApi = createApi({
  reducerPath: "landingApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchLanding: build.query<LandingCustomSectionComponent[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchLanding()) as
            | LandingCustomSectionComponent[]
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
