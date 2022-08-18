import { useSelector } from "^redux/hooks";
import { selectTotal } from "^redux/state/recordedEvents";
import AutoSectionUI from "../AutoSectionUI";
import RecordedEventsSwiper from "./RecordedEventsSwiper";

const RecordedEventsSection = () => {
  const numRecordedEvents = useSelector(selectTotal);

  return numRecordedEvents ? <Populated /> : <Unpopulated />;
};

export default RecordedEventsSection;

const Populated = () => (
  <AutoSectionUI
    colorTheme="white"
    swiper={<RecordedEventsSwiper />}
    title="Videos"
    moreFromText="More from videos"
  />
);

const Unpopulated = () => (
  <AutoSectionUI.Empty colorTheme="white" docType="videos" />
);
