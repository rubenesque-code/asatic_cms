import NextImage, { ImageProps } from "next/image";

import { Image as ImageType } from "^types/image";

const ImageWrapper = ({
  image,
  layout = "fill",
  objectFit = "contain",
}: {
  image: ImageType;
  layout?: ImageProps["layout"];
  objectFit?: ImageProps["objectFit"];
}) => (
  <NextImage
    src={image.URL}
    placeholder="blur"
    blurDataURL={image.blurURL}
    layout={layout}
    objectFit={objectFit}
  />
);

export default ImageWrapper;
