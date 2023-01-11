import { $Populated } from "../_presentation/$Section_";
import Swiper from "./swiper";

const Populated = () => {
  return (
    <$Populated
      colorTheme="white"
      moreFromText="More from talks & events"
      swiper={<Swiper />}
      title="Talks & Events"
    />
  );
};

export default Populated;
