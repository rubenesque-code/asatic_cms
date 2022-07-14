import NextImage, { ImageProps } from "next/image";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/images";

const ImageWrapper = ({
  imgId,
  layout = "fill",
  objectFit = "contain",
  vertPosition = 50,
}: {
  imgId: string;
  layout?: ImageProps["layout"];
  objectFit?: ImageProps["objectFit"];
  vertPosition?: number;
}) => {
  const image = useSelector((state) => selectById(state, imgId));

  const position = `50% ${vertPosition}%`;

  return image ? (
    <NextImage
      src={image.URL}
      placeholder="blur"
      blurDataURL={image.blurURL}
      layout={layout}
      objectFit={objectFit}
      objectPosition={position}
    />
  ) : (
    <InvalidImage />
  );
};

export default ImageWrapper;

const InvalidImage = () => <div css={[tw`h-full`]}>Error</div>;
