import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createTag } from "^data/createDocument";

import { fetchTags } from "^lib/firebase/firestore/fetch";
import { writeTag } from "^lib/firebase/firestore/write/writeDocs";
import { deleteParentEntity } from "^lib/firebase/firestore/write/batchDeleteParentEntity";

import { Tag, TagRelatedEntity, TagRelatedEntityTuple } from "^types/tag";
import { RelatedEntityFields } from "^types/entity";
import { toast } from "react-toastify";

type Tags = Tag[];

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchTags: build.query<Tags, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchTags()) as Tags | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    createTag: build.mutation<{ tag: Tag }, Parameters<typeof createTag>[0]>({
      queryFn: async (createTagArg) => {
        try {
          const newTag = createTag(createTagArg);
          await writeTag(newTag);

          return {
            data: { tag: newTag },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteTag: build.mutation<
      { id: string },
      {
        id: string;
        subEntities: RelatedEntityFields<TagRelatedEntity>;
        useToasts?: boolean;
      }
    >({
      queryFn: async ({ useToasts = true, id, subEntities }) => {
        try {
          const handleDelete = async () => {
            await deleteParentEntity<TagRelatedEntityTuple>({
              parentEntity: { id, name: "tag" },
              subEntities: [
                { name: "article", ids: subEntities.articlesIds },
                { name: "blog", ids: subEntities.blogsIds },
                { name: "collection", ids: subEntities.collectionsIds },
                { name: "recordedEvent", ids: subEntities.recordedEventsIds },
                { name: "subject", ids: subEntities.subjectsIds },
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

export const { useFetchTagsQuery, useCreateTagMutation, useDeleteTagMutation } =
  tagsApi;
