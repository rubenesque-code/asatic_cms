import { $Populated } from "../_styles/Presentation";
import Swiper from "./swiper";

const Populated = () => {
  return (
    <$Populated
      colorTheme="cream"
      moreFromText="More from articles"
      swiper={<Swiper />}
      title="Articles"
    />
  );
};

export default Populated;
