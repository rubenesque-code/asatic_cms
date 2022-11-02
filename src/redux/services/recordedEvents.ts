import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import produce from "immer";
import { v4 as generateUId } from "uuid";

import { fetchRecordedEvents } from "^lib/firebase/firestore/fetch";

import { RecordedEvent } from "^types/recordedEvent";
import { createRecordedEvent } from "src/data/createDocument";
import {
  deleteRecordedEvent,
  writeRecordedEvent,
} from "^lib/firebase/firestore/write/writeDocs";
import { toast } from "react-toastify";

type FirestoreRecordedEvent = Omit<RecordedEvent, "lastSave, publishInfo"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSave: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishDate: any;
};
type FirestoreRecordedEvents = FirestoreRecordedEvent[];

export const recordedEventsApi = createApi({
  reducerPath: "recordedEventsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    createRecordedEvent: build.mutation<{ recordedEvent: RecordedEvent }, void>(
      {
        queryFn: async () => {
          try {
            const newDoc = createRecordedEvent({
              id: generateUId(),
              translationId: generateUId(),
            });
            await writeRecordedEvent(newDoc);

            return {
              data: { recordedEvent: newDoc },
            };
          } catch (error) {
            return { error: true };
          }
        },
      }
    ),
    deleteRecordedEvent: build.mutation<
      { id: string },
      { id: string; useToasts?: boolean; onDelete?: () => void }
    >({
      queryFn: async ({ id, useToasts = false, onDelete }) => {
        try {
          const handleDelete = async () => {
            await deleteRecordedEvent(id);
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
    fetchRecordedEvents: build.query<RecordedEvent[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchRecordedEvents()) as
            | FirestoreRecordedEvents
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
          }) as RecordedEvent[];

          return { data: dataFormatted };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const {
  useFetchRecordedEventsQuery,
  useCreateRecordedEventMutation,
  useDeleteRecordedEventMutation,
} = recordedEventsApi;
