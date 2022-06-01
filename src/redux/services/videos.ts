import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { fetchVideos } from "^lib/firebase/firestore/fetch";
import { Video } from "^types/video";

type Videos = Video[];

export const videosApi = createApi({
  reducerPath: "videosApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchVideos: build.query<Videos, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchVideos()) as Videos | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchVideosQuery } = videosApi;
