/* eslint-disable jsx-a11y/alt-text */
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

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
  ] = ArticleImageSectionSlice.useContext();

  return (
    <Image_
      myImageProps={{ imageId: imageId!, vertPosition: vertPosition || 50 }}
    />
  );
};

const Caption = () => {
  const [{ caption }, { updateBodyImageCaption }] =
    ArticleImageSectionSlice.useContext();

  return (
    <Caption_
      caption={caption}
      updateCaption={(caption) => updateBodyImageCaption({ caption })}
    />
  );
};
