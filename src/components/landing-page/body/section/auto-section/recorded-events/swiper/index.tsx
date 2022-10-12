import { useSelector } from "^redux/hooks";
import { selectRecordedEvents } from "^redux/state/recordedEvents";

import { orderDisplayContent } from "^helpers/displayContent";
import { mapIds } from "^helpers/general";

import Swiper_ from "../../_containers/Swiper";
import SwiperSlideContent from "./swiper-slide-content";

const Swiper = () => {
  const recordedEvents = useSelector(selectRecordedEvents);
  const ordered = orderDisplayContent(recordedEvents);
  const recordedEventsIds = mapIds(ordered);

  return (
    <Swiper_
      colorTheme="white"
      slides={recordedEventsIds.map((recordedEventId) => (
        <SwiperSlideContent
          recordedEventId={recordedEventId}
          key={recordedEventId}
        />
      ))}
    />
  );
};

export default Swiper;
