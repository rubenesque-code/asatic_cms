import { $Populated } from "../_presentation/Section";
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
