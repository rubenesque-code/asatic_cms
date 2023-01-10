import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import produce from "immer";

import { createSubject } from "^data/createDocument";

import { fetchSubjects } from "^lib/firebase/firestore/fetch";
import { writeSubject } from "^lib/firebase/firestore/write/writeDocs";
import { deleteParentEntity } from "^lib/firebase/firestore/write/batchDeleteParentEntity";
import {
  Subject as LocalSubject,
  SubjectRelatedEntity,
  SubjectRelatedEntityTuple,
} from "^types/subject";
import { toast } from "react-toastify";
import { RelatedEntityFields } from "^types/entity";
import { MyOmit } from "^types/utilities";

type FirestoreSubject = MyOmit<LocalSubject, "lastSave" | "publishDate"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSave: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishDate: any;
};

export const subjectsApi = createApi({
  reducerPath: "subjectsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchSubjects: build.query<LocalSubject[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchSubjects()) as
            | FirestoreSubject[]
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
          }) as LocalSubject[];

          return { data: dataFormatted };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    createSubject: build.mutation<
      { subject: LocalSubject },
      Parameters<typeof createSubject>[0]
    >({
      queryFn: async (createSubjectArg) => {
        try {
          const newSubject = createSubject(createSubjectArg);
          await writeSubject(newSubject);

          return {
            data: { subject: newSubject },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteSubject: build.mutation<
      { id: string },
      {
        id: string;
        subEntities: RelatedEntityFields<SubjectRelatedEntity>;
        useToasts?: boolean;
      }
    >({
      queryFn: async ({ useToasts = false, id, subEntities }) => {
        try {
          const handleDelete = async () => {
            await deleteParentEntity<SubjectRelatedEntityTuple>({
              parentEntity: { id, name: "subject" },
              subEntities: [
                { name: "article", ids: subEntities.articlesIds },
                { name: "blog", ids: subEntities.blogsIds },
                { name: "collection", ids: subEntities.collectionsIds },
                { name: "recordedEvent", ids: subEntities.recordedEventsIds },
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
  useFetchSubjectsQuery,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsApi;
