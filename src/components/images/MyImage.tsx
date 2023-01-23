import NextImage, { ImageProps } from "next/image";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/images";

export type MyImageProps = {
  imageId: string;
  layout?: ImageProps["layout"];
  objectFit?: ImageProps["objectFit"];
  vertPosition?: number;
};

const MyImage = ({
  imageId,
  layout = "fill",
  objectFit = "contain",
  vertPosition = 50,
}: MyImageProps) => {
  const image = useSelector((state) => selectById(state, imageId));
  console.log("image:", image);

  const position = `50% ${vertPosition}%`;

  return (
    <div css={[tw`w-full h-full`]}>
      {image ? (
        <NextImage
          src={image.URL}
          placeholder="blur"
          blurDataURL={image.blurURL}
          layout={layout}
          objectFit={objectFit}
          objectPosition={position}
        />
      ) : (
        <p>
          Couldn&apos;t find image. Try refreshing; otherwise, change the image.
        </p>
      )}
    </div>
  );
};

export default MyImage;

// const InvalidImage = () => <div css={[tw`h-full`]}>Error</div>;
