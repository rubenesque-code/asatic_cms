/* eslint-disable jsx-a11y/alt-text */
import { $BannerContainer } from "./_styles";
import Image from "./image";
import Meta from "./meta";

const Banner = () => {
  return (
    <$BannerContainer>
      <Image />
      <Meta />
    </$BannerContainer>
  );
};

export default Banner;
