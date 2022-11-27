import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

import { createAuthor } from "^data/createDocument";

import { fetchAuthors } from "^lib/firebase/firestore/fetch";
import { writeAuthor } from "^lib/firebase/firestore/write/writeDocs";
import { deleteParentEntity } from "^lib/firebase/firestore/write/batchDeleteParentEntity";

import {
  Author,
  AuthorRelatedEntity,
  AuthorRelatedEntityTuple,
} from "^types/author";
import { RelatedEntityFields } from "^types/entity";

type Authors = Author[];

export const authorsApi = createApi({
  reducerPath: "authorsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchAuthors: build.query<Authors, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchAuthors()) as Authors | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    createAuthor: build.mutation<
      { author: Author },
      Parameters<typeof createAuthor>[0]
    >({
      queryFn: async (createAuthorArg) => {
        try {
          const newAuthor = createAuthor(createAuthorArg);
          await writeAuthor(newAuthor);

          return {
            data: { author: newAuthor },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteAuthor: build.mutation<
      { id: string },
      {
        id: string;
        subEntities: RelatedEntityFields<AuthorRelatedEntity>;
        useToasts?: boolean;
      }
    >({
      queryFn: async ({ useToasts = true, id, subEntities }) => {
        try {
          const handleDelete = async () => {
            await deleteParentEntity<AuthorRelatedEntityTuple>({
              parentEntity: { id, name: "collection" },
              subEntities: [
                { name: "article", ids: subEntities.articlesIds },
                { name: "blog", ids: subEntities.blogsIds },
                { name: "recordedEvent", ids: subEntities.recordedEventsIds },
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
  useFetchAuthorsQuery,
  useCreateAuthorMutation,
  useDeleteAuthorMutation,
} = authorsApi;
