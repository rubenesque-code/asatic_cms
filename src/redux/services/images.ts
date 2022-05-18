import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchImages } from "^lib/firebase/storage/fetch";

import { uploadImage } from "^lib/firebase/storage/write";
import { Image } from "^types/image";

const FETCHTAG = "fetch-images";

export const imagesApi = createApi({
  reducerPath: "imagesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [FETCHTAG],
  endpoints: (build) => ({
    fetchImages: build.query<Image[], void>({
      queryFn: async () => {
        try {
          const data = (await fetchImages()) || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
      providesTags: [FETCHTAG],
    }),
    uploadImage: build.mutation<{ URLEndpoint: string }, File>({
      queryFn: async (file) => {
        try {
          const URLEndpoint = await uploadImage(file);

          return { data: { URLEndpoint } };
        } catch (error) {
          return { error: true };
        }
      },
      invalidatesTags: [FETCHTAG],
    }),
  }),
});

export const { useUploadImageMutation, useFetchImagesQuery } = imagesApi;
