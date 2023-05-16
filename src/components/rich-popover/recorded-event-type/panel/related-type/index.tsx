import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import Populated from "./populated";

const RelatedType = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  if (!recordedEventTypeId) {
    return null;
  }

  return <Populated />;
};

export default RelatedType;
