import Description from "./Description";
import BannerImage from "./image";

import { BannerContainer } from "./style";

const Banner = () => {
  return (
    <BannerContainer>
      <BannerImage />
      <Description />
    </BannerContainer>
  );
};

export default Banner;
