import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchRecordedEventTypes } from "^lib/firebase/firestore/fetch";

import { RecordedEventType } from "^types/recordedEventType";

export const recordedEventTypesApi = createApi({
  reducerPath: "recordedEventTypesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchRecordedEventTypes: build.query<RecordedEventType[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchRecordedEventTypes()) as
            | RecordedEventType[]
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

export const { useFetchRecordedEventTypesQuery } = recordedEventTypesApi;
