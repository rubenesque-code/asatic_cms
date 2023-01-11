import { $Populated } from "../_presentation/$Section_";
import Swiper from "./swiper";

const Populated = () => {
  return (
    <$Populated
      colorTheme="white"
      moreFromText="More from collections"
      swiper={<Swiper />}
      title="Collections"
    />
  );
};

export default Populated;
