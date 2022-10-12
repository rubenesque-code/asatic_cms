import { $Populated } from "../_presentation/Section";
import Swiper from "./swiper";

const Populated = () => {
  return (
    <$Populated
      colorTheme="blue"
      moreFromText="More from blogs"
      swiper={<Swiper />}
      title="Blogs"
    />
  );
};

export default Populated;
