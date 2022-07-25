import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import produce from "immer";

import { fetchRecordedEvents } from "^lib/firebase/firestore/fetch";

import { RecordedEvent } from "^types/recordedEvent";
import { PublishStatus } from "^types/editable_content";

type FirestoreRecordedEvent = Omit<RecordedEvent, "lastSave, publishInfo"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSave: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishInfo: { status: PublishStatus; date: any };
};
type FirestoreRecordedEvents = FirestoreRecordedEvent[];

export const recordedEventsApi = createApi({
  reducerPath: "recordedEventsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
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

              const publishDate = draft[i].publishInfo.date;
              if (publishDate) {
                draft[i].publishInfo.date = publishDate.toDate();
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

export const { useFetchRecordedEventsQuery } = recordedEventsApi;
