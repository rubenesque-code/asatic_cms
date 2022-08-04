import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/recordedEvents";
import { RecordedEvent } from "^types/recordedEvent";

const useFilterRecordedEventsByUse = (
  field: keyof Pick<
    RecordedEvent,
    "authorIds" | "collectionIds" | "subjectIds" | "tagIds"
  >,
  docId: string
) => {
  const entities = useSelector(selectAll);
  const filtered = entities.filter((article) => {
    const isDocEntity = article[field].includes(docId);

    return isDocEntity;
  });

  return filtered;
};

export default useFilterRecordedEventsByUse;
