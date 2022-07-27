import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as generateUId } from "uuid";
import produce from "immer";

import { createNewArticle } from "src/data/documents/article";

import { fetchArticles } from "^lib/firebase/firestore/fetch";
import {
  deleteArticle,
  writeArticle,
} from "^lib/firebase/firestore/write/writeDocs";
import { Article, Article as LocalArticle } from "^types/article";
import { PublishStatus } from "^types/editable_content";

type FirestoreArticle = Omit<LocalArticle, "lastSave, publishInfo"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSave: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishInfo: { status: PublishStatus; date: any };
};
type FirestoreArticles = FirestoreArticle[];

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    createArticle: build.mutation<{ article: Article }, void>({
      queryFn: async () => {
        try {
          const newArticle = createNewArticle({
            id: generateUId(),
            translationId: generateUId(),
          });
          await writeArticle(newArticle);

          return {
            data: { article: newArticle },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteArticle: build.mutation<{ id: string }, string>({
      queryFn: async (id) => {
        try {
          await deleteArticle(id);

          return {
            data: { id },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    fetchArticles: build.query<LocalArticle[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchArticles()) as
            | FirestoreArticles
            | undefined;
          const data = resData || [];

          const dataFormatted = produce(data, (draft) => {
            for (let i = 0; i < draft.length; i++) {
              const lastSave = draft[i].lastSave;
              if (lastSave) {
                draft[i].lastSave = lastSave.toDate();
              }
              draft[i].lastSave = lastSave ? lastSave.toDate() : lastSave;

              const publishDate = draft[i].publishInfo.date;
              if (publishDate) {
                draft[i].publishInfo.date = publishDate.toDate();
              }
            }
          }) as LocalArticle[];

          return { data: dataFormatted };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const {
  useFetchArticlesQuery,
  useCreateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;
