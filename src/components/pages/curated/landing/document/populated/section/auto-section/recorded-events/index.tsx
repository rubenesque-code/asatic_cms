import { useSelector } from "^redux/hooks";
import { selectTotalRecordedEvents } from "^redux/state/recordedEvents";

import { $Empty, $Populated } from "../_presentation/Section";
import Swiper from "./swiper";

const Collections = () => {
  /*   const numRecordedEvents = useSelector(selectTotalRecordedEvents);

  return numRecordedEvents ? (
    <$Populated
      colorTheme="white"
      moreFromText="More form talks & events"
      swiper={<Swiper />}
      title="Talks & Events"
    />
  ) : (
    <$Empty docType="Talks & Events" />
  ); */
  return <div>Re</div>;
};

export default Collections;
