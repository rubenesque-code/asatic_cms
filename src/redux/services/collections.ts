import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { v4 as generateUId } from "uuid";

import { createCollection } from "^data/createDocument";

import { fetchCollections } from "^lib/firebase/firestore/fetch";
import {
  deleteCollection,
  writeCollection,
} from "^lib/firebase/firestore/write/writeDocs";
import { Collection } from "^types/collection";

export const collectionsApi = createApi({
  reducerPath: "collectionsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchCollections: build.query<Collection[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchCollections()) as
            | Collection[]
            | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    createCollection: build.mutation<{ collection: Collection }, void>({
      queryFn: async () => {
        try {
          const newCollection = createCollection({
            id: generateUId(),
            translationId: generateUId(),
          });
          await writeCollection(newCollection);

          return {
            data: { collection: newCollection },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteCollection: build.mutation<
      { id: string },
      { id: string; useToasts?: boolean }
    >({
      queryFn: async ({ id, useToasts = false }) => {
        try {
          if (useToasts) {
            toast.promise(deleteCollection(id), {
              pending: "deleting...",
              success: "deleted",
              error: "delete error",
            });
          } else {
            deleteCollection(id);
          }

          return {
            data: { id },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const {
  useFetchCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionsApi;
