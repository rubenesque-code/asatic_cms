import { orderDisplayContent } from "^helpers/displayContent";

import { Swiper_ } from "^components/_containers/Swiper_";
import RecordedEventSummary from "./collection";
import { RecordedEvent } from "^types/recordedEvent";

const Swiper = ({ recordedEvents }: { recordedEvents: RecordedEvent[] }) => {
  const ordered = orderDisplayContent(recordedEvents);

  return (
    <Swiper_
      colorTheme="white"
      slides={ordered.map((recordedEvent) => (
        <RecordedEventSummary
          recordedEvent={recordedEvent}
          key={recordedEvent.id}
        />
      ))}
    />
  );
};

export default Swiper;
