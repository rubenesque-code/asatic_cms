import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSubject } from "^data/createDocument";

import { fetchSubjects } from "^lib/firebase/firestore/fetch";
import { writeSubject } from "^lib/firebase/firestore/write/writeDocs";
import {
  deleteSubject,
  DeleteSubjectProps,
} from "^lib/firebase/firestore/write/batchDeleteParentEntity";
import { Subject } from "^types/subject";
import { toast } from "react-toastify";

type Subjects = Subject[];

export const subjectsApi = createApi({
  reducerPath: "subjectsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchSubjects: build.query<Subjects, void>({
      queryFn: async () => {
        try {
          const resData = (await fetchSubjects()) as Subjects | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    createSubject: build.mutation<
      { subject: Subject },
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
      { useToasts?: boolean } & DeleteSubjectProps
    >({
      queryFn: async ({ useToasts = false, ...deleteSubjectProps }) => {
        try {
          const handleDelete = async () => {
            await deleteSubject(deleteSubjectProps);
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
            data: { id: deleteSubjectProps.id },
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
