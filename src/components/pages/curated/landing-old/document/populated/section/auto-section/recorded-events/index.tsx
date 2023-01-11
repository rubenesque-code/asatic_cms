import { useSelector } from "^redux/hooks";
import { selectTotalRecordedEvents } from "^redux/state/recordedEvents";

import Empty from "./Empty";
import Populated from "./Populated";

const RecordedEvents = () => {
  const numRecordedEvents = useSelector(selectTotalRecordedEvents);

  return numRecordedEvents ? <Populated /> : <Empty />;
};

export default RecordedEvents;
