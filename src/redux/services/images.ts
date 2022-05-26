import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as generateUId } from "uuid";
import { fetchImages } from "^lib/firebase/firestore/fetch";

import { uploadImage } from "^lib/firebase/storage/write";
import { writeImage } from "^lib/firebase/firestore/write";
import { Image } from "^types/image";

type Images = Image[];

// const FETCHTAG = "fetch-images";

export const imagesApi = createApi({
  reducerPath: "imagesApi",
  baseQuery: fakeBaseQuery(),
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
    }),
    uploadImageAndCreateImageDoc: build.mutation<Image, File>({
      queryFn: async (file) => {
        try {
          const { URL, URLstorageId, blurURL, blurURLstorageId } =
            await uploadImage(file);
          const id = generateUId();
          await writeImage({
            id,
            URL,
            URLstorageId,
            blurURL,
            blurURLstorageId,
          });

          return { data: { id, URL, URLstorageId, blurURL, blurURLstorageId } };
        } catch (error) {
          console.log("error", error);

          return { error: true };
        }
      },
    }),
  }),
});

export const { useUploadImageAndCreateImageDocMutation, useFetchImagesQuery } =
  imagesApi;
