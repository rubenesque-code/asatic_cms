import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import { $Cell } from "^components/display-entities-table/styles";

const TypeCell = () => {
  const [{ recordedEventType: type }] = RecordedEventSlice.useContext();

  return <$Cell>{type ? type : "-"}</$Cell>;
};

export default TypeCell;
