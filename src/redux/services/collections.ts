import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import produce from "immer";

import { createCollection } from "^data/createDocument";

import { fetchCollections } from "^lib/firebase/firestore/fetch";
import { writeCollection } from "^lib/firebase/firestore/write/writeDocs";
import { deleteParentEntity } from "^lib/firebase/firestore/write/batchDeleteParentEntity";
import {
  Collection,
  CollectionRelatedEntity,
  CollectionRelatedEntityTuple,
} from "^types/collection";
import { MyOmit } from "^types/utilities";
import { RelatedEntityFields } from "^types/entity";

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
      Parameters<typeof createCollection>[0] & { useToasts?: boolean }
    >({
      queryFn: async ({ useToasts, ...createCollectionArg }) => {
        try {
          const newCollection = createCollection(createCollectionArg);

          if (useToasts) {
            toast.promise(async () => await writeCollection(newCollection), {
              error: "create error",
              pending: "creating...",
              success: "created",
            });
          } else {
            await writeCollection(newCollection);
          }

          return {
            data: { collection: newCollection },
          };
        } catch (error) {
          console.log("error:", error);
          return { error: true };
        }
      },
    }),
    deleteCollection: build.mutation<
      { id: string },
      {
        id: string;
        subEntities: RelatedEntityFields<CollectionRelatedEntity>;
        useToasts?: boolean;
      }
    >({
      queryFn: async ({ useToasts = true, id, subEntities }) => {
        try {
          const handleDelete = async () => {
            await deleteParentEntity<CollectionRelatedEntityTuple>({
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
