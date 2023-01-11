import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { Status_ } from "^components/pages/curated/_containers/entity-summary";
import { $status } from "../../../../_styles/entity";

const Status = () => {
  const [{ publishDate, status }] = RecordedEventSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

export default Status;
