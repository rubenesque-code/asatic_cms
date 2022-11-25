import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import produce from "immer";

import { createCollection } from "^data/createDocument";

import { fetchCollections } from "^lib/firebase/firestore/fetch";
import { writeCollection } from "^lib/firebase/firestore/write/writeDocs";
import { deleteParentEntity } from "^lib/firebase/firestore/write/batchDeleteParentEntity";
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
    createCollection: build.mutation<
      { collection: Collection },
      Parameters<typeof createCollection>[0]
    >({
      queryFn: async (createCollectionArg) => {
        try {
          const newCollection = createCollection(createCollectionArg);
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
      {
        id: string;
        subEntities: {
          articlesIds: string[];
          blogsIds: string[];
          recordedEventsIds: string[];
          subjectsIds: string[];
          tagsIds: string[];
        };
        useToasts?: boolean;
      }
    >({
      queryFn: async ({ useToasts = true, id, subEntities }) => {
        try {
          const handleDelete = async () => {
            await deleteParentEntity<
              ["article", "blog", "recordedEvent", "subject", "tag"]
            >({
              parentEntity: { id, name: "collection" },
              subEntities: [
                { name: "article", ids: subEntities.articlesIds },
                { name: "blog", ids: subEntities.blogsIds },
                { name: "recordedEvent", ids: subEntities.recordedEventsIds },
                { name: "subject", ids: subEntities.subjectsIds },
                { name: "tag", ids: subEntities.tagsIds },
              ],
            });
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
