import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchImages } from "^lib/firebase/firestore/fetch";

import {
  deleteImage as deleteStorageImage,
  uploadImage as uploadImageToStorage,
} from "^lib/firebase/storage/write";
import {
  writeImage as writeImageDoc,
  deleteImage as deleteImageDoc,
} from "^lib/firebase/firestore/write/batchWritePages";
import { Image, ImageKeywords } from "^types/image";

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
      Image,
      { file: File; keywords: ImageKeywords }
    >({
      queryFn: async ({ file, keywords }) => {
        try {
          const { unresizedId: id, ...resizedIdsAndURLs } =
            await uploadImageToStorage(file);

          const imageData = {
            id,
            keywords,
            ...resizedIdsAndURLs,
          };

          await writeImageDoc(imageData);

          return {
            data: imageData,
          };
        } catch (error) {
          return { error: true };
        }
      },
      invalidatesTags: [FETCHTAG],
    }),
    deleteUploadedImage: build.mutation<string, string>({
      queryFn: async (unresizedId) => {
        try {
          await deleteStorageImage(unresizedId);
          await deleteImageDoc(unresizedId);

          return { data: unresizedId };
        } catch (error) {
          return { error: true };
        }
      },
      invalidatesTags: [FETCHTAG],
    }),
  }),
});

export const {
  useDeleteUploadedImageMutation,
  useUploadImageAndCreateImageDocMutation,
  useFetchImagesQuery,
} = imagesApi;
