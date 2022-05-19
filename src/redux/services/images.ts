import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as generateUId } from "uuid";
import { fetchImages } from "^lib/firebase/firestore/fetch";

import { uploadImage } from "^lib/firebase/storage/write";
import { writeImage } from "^lib/firebase/firestore/write";
import { Image } from "^types/image";

type Images = Image[];

const FETCHTAG = "fetch-images";

export const imagesApi = createApi({
  reducerPath: "imagesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [FETCHTAG],
  endpoints: (build) => ({
    fetchImages: build.query<Images, void>({
      queryFn: async () => {
        try {
          const data = ((await fetchImages()) as Images) || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
      providesTags: [FETCHTAG],
    }),
    uploadImageAndCreateImageDoc: build.mutation<
      { id: string; URL: string },
      File
    >({
      queryFn: async (file) => {
        try {
          const { id: storageId, URL } = await uploadImage(file);
          const id = generateUId();
          await writeImage({
            id,
            URL,
            storageId,
          });

          return { data: { id, URL } };
        } catch (error) {
          return { error: true };
        }
      },
      invalidatesTags: [FETCHTAG],
    }),
  }),
});

export const { useUploadImageAndCreateImageDocMutation, useFetchImagesQuery } =
  imagesApi;
