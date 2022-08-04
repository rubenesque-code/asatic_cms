import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { v4 as generateUId } from "uuid";

import { createAuthor } from "^data/createDocument";

import { fetchAuthors } from "^lib/firebase/firestore/fetch";
import {
  deleteAuthor,
  writeAuthor,
} from "^lib/firebase/firestore/write/writeDocs";
import { Author } from "^types/author";

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
    createAuthor: build.mutation<{ author: Author }, void>({
      queryFn: async () => {
        try {
          const author = createAuthor({
            id: generateUId(),
            translationId: generateUId(),
          });
          await writeAuthor(author);

          return {
            data: { author },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteAuthor: build.mutation<
      { id: string },
      { id: string; useToasts?: boolean }
    >({
      queryFn: async ({ id, useToasts = false }) => {
        try {
          if (useToasts) {
            toast.promise(deleteAuthor(id), {
              pending: "deleting...",
              success: "deleted",
              error: "delete error",
            });
          } else {
            deleteAuthor(id);
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

export const { useFetchAuthorsQuery } = authorsApi;
