import { $Populated } from "../_presentation/$Section_";
import Swiper from "./swiper";

const Populated = () => {
  return (
    <$Populated
      moreFromText="More from videos"
      swiper={<Swiper />}
      title="Videos"
    />
  );
};

export default Populated;
