import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { Status_ } from "^components/pages/curated/_containers/entity-summary";
import { $status } from "../_styles";

const Status = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

export default Status;
