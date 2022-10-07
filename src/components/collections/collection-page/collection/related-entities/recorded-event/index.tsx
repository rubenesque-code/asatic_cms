import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import Status from "../related-entity/Status";
import Summary from "./Summary";

const RecordedEvent = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return (
    <>
      <Status publishDate={publishDate} status={status} />
      <Summary />
    </>
  );
};

export default RecordedEvent;
