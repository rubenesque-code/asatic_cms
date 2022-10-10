import { useSelector } from "^redux/hooks";
import { selectRecordedEventsIds } from "^redux/state/recordedEvents";

import AutoSectionSwiper from "../Swiper2";
import RecordedEvent from ".";

const RecordedEventsSwiper = () => {
  const recordedEventsIds = useSelector(selectRecordedEventsIds) as string[];

  return (
    <AutoSectionSwiper
      elements={recordedEventsIds.map((id) => (
        <RecordedEvent id={id} key={id} />
      ))}
    />
  );
};

export default RecordedEventsSwiper;
