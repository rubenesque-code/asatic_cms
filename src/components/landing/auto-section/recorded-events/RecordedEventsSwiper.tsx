import { useSelector } from "^redux/hooks";
import { selectIds } from "^redux/state/recordedEvents";
import AutoSectionSwiper from "../Swiper2";
import RecordedEvent from "./RecordedEvent";

const RecordedEventsSwiper = () => {
  const recordedEventsIds = useSelector(selectIds);

  return (
    <AutoSectionSwiper
      elements={recordedEventsIds.map((id) => (
        <RecordedEvent id={id} key={id} />
      ))}
    />
  );
};

export default RecordedEventsSwiper;
