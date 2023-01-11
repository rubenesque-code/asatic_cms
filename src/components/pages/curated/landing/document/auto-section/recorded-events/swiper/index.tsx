import { orderDisplayContent } from "^helpers/displayContent";
import { mapIds } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectRecordedEvents } from "^redux/state/recordedEvents";

import { Swiper_ } from "../../_containers/Swiper_";
import Slide from "./slide";

const Swiper = () => {
  const recordedEvents = useSelector(selectRecordedEvents);
  const ordered = orderDisplayContent(recordedEvents);
  const recordedEventsIds = mapIds(ordered);

  return (
    <Swiper_
      colorTheme="cream"
      slides={recordedEventsIds.map((articleId) => (
        <Slide recordedEventId={articleId} key={articleId} />
      ))}
    />
  );
};

export default Swiper;
