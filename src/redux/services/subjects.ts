import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchSubjects } from "^lib/firebase/firestore/fetch";
import { Subject } from "^types/subject";

type Subjects = Subject[];

export const subjectsApi = createApi({
  reducerPath: "subjectsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchSubjects: build.query<Subjects, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchSubjects()) as Subjects | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchSubjectsQuery } = subjectsApi;
