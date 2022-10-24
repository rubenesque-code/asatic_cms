import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import Status from "../Status";
import { Container } from "../styles";
import Summary from "./Summary";

const RecordedEvent = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return (
    <Container>
      <Status publishDate={publishDate} status={status} />
      <Summary />
    </Container>
  );
};

export default RecordedEvent;
