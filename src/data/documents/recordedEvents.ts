import { default_language_Id } from "^constants/data";
import { RecordedEvent } from "^types/recordedEvent";

export const createNewRecordedEvent = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): RecordedEvent => ({
  id,
  publishInfo: {
    status: "draft",
  },
  authorIds: [],
  collectionIds: [],
  subjectIds: [],
  tagIds: [],
  translations: [
    {
      id: translationId,
      languageId: default_language_Id,
      body: [],
    },
  ],
  type: "recorded-event",
  summaryImage: {},
});
