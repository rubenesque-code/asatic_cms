import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as generateUId } from "uuid";
import produce from "immer";
import { toast } from "react-toastify";

import { createBlog } from "src/data/createDocument";

import { fetchBlogs } from "^lib/firebase/firestore/fetch";
import { writeBlog, deleteBlog } from "^lib/firebase/firestore/write/writeDocs";
import { Blog } from "^types/blog";
import { MyOmit } from "^types/utilities";

type FirestoreBlog = MyOmit<Blog, "lastSave" | "publishDate"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSave: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishDate: any;
};

export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    createBlog: build.mutation<{ blog: Blog }, void>({
      queryFn: async () => {
        try {
          const newBlog = createBlog({
            id: generateUId(),
            translationId: generateUId(),
          });
          await writeBlog(newBlog);

          return {
            data: { blog: newBlog },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteBlog: build.mutation<
      { id: string },
      { id: string; useToasts?: boolean; onDelete?: () => void }
    >({
      queryFn: async ({ id, useToasts = false, onDelete }) => {
        try {
          const handleDelete = async () => {
            await deleteBlog(id);
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
    fetchBlogs: build.query<Blog[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchBlogs()) as FirestoreBlog[] | undefined;
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
          }) as Blog[];

          return { data: dataFormatted };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useFetchBlogsQuery,
} = blogsApi;
