/* eslint-disable jsx-a11y/alt-text */
import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";

import { $MediaSectionContainer_ } from "^components/pages/curated/document/_presentation/article-like";
import {
  Image_,
  Caption_,
} from "^components/pages/curated/document/_containers/article-like";
import Menu from "./Menu";

const Populated = () => {
  return (
    <$MediaSectionContainer_
      menu={(containerIsHovered) => (
        <Menu isImage isShowing={containerIsHovered} />
      )}
    >
      <Image />
      <Caption />
    </$MediaSectionContainer_>
  );
};

export default Populated;

const Image = () => {
  const [
    {
      image: { imageId, vertPosition },
    },
  ] = BlogImageSectionSlice.useContext();

  return <Image_ myImageProps={{ imageId: imageId!, vertPosition }} />;
};

const Caption = () => {
  const [{ caption }, { updateBodyImageCaption }] =
    BlogImageSectionSlice.useContext();

  return (
    <Caption_
      caption={caption}
      updateCaption={(caption) => updateBodyImageCaption({ caption })}
    />
  );
};
