import NextImage, { ImageProps } from "next/image";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/images";

const ImageWrapper = ({
  imgId,
  layout = "fill",
  objectFit = "contain",
}: {
  imgId: string;
  layout?: ImageProps["layout"];
  objectFit?: ImageProps["objectFit"];
}) => {
  const image = useSelector((state) => selectById(state, imgId));

  return image ? (
    <NextImage
      src={image.URL}
      placeholder="blur"
      blurDataURL={image.blurURL}
      layout={layout}
      objectFit={objectFit}
    />
  ) : (
    <InvalidImage />
  );
};

export default ImageWrapper;

const InvalidImage = () => <div css={[tw`h-full`]}>Error</div>;
