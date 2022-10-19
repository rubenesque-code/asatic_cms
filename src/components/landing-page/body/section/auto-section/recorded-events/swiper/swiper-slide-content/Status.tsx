import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { Status_ } from "../../../_containers/Entity_";

const Status = () => {
  const [{ publishDate, status }] = RecordedEventSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

export default Status;
