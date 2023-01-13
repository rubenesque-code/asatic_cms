import { $Populated } from "../_presentation/$Section_";
import Swiper from "./swiper";

const Populated = () => {
  return (
    <$Populated
      moreFromText="More from collections"
      swiper={<Swiper />}
      title="Collections"
    />
  );
};

export default Populated;
