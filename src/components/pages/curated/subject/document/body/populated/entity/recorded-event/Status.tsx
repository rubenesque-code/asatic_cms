import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { Status_ } from "^components/pages/curated/_containers/entity-summary";
import { $statusContainer } from "../_styles";

const Status = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return (
    <Status_
      publishDate={publishDate}
      status={status}
      styles={$statusContainer}
    />
  );
};

export default Status;
