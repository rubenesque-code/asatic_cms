import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { v4 as generateUId } from "uuid";
import produce from "immer";

import { createCollection } from "^data/createDocument";

import { fetchCollections } from "^lib/firebase/firestore/fetch";
import {
  deleteCollection,
  writeCollection,
} from "^lib/firebase/firestore/write/writeDocs";
import { Collection } from "^types/collection";
import { MyOmit } from "^types/utilities";

type FirestoreCollection = MyOmit<Collection, "lastSave" | "publishDate"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSave: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishDate: any;
};

export const collectionsApi = createApi({
  reducerPath: "collectionsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchCollections: build.query<Collection[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchCollections()) as
            | FirestoreCollection[]
            | undefined;
          const data = resData || [];

          const dataFormatted = produce(data, (draft) => {
            for (let i = 0; i < draft.length; i++) {
              const lastSave = draft[i].lastSave;
              if (lastSave) {
                draft[i].lastSave = lastSave.toDate();
              }
              draft[i].lastSave = lastSave ? lastSave.toDate() : lastSave;

              const publishDate = draft[i].publishDate;
              if (publishDate) {
                draft[i].publishDate = publishDate.toDate();
              }
            }
          }) as Collection[];

          return { data: dataFormatted };
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
            title: "",
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
      { id: string; useToasts?: boolean; onDelete?: () => void }
    >({
      queryFn: async ({ id, useToasts = false, onDelete }) => {
        try {
          const handleDelete = async () => {
            await deleteCollection(id);
            if (onDelete) {
              onDelete();
            }
          };
          if (useToasts) {
            toast.promise(handleDelete, {
              pending: "deleting...",
              success: "deleted",
              error: "delete error",
            });
          } else {
            handleDelete();
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
