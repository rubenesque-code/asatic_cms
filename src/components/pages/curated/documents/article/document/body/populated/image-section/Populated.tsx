/* eslint-disable jsx-a11y/alt-text */
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

import { $MediaSectionContainer_ } from "^document-pages/_presentation/article-like";
import { Image_, Caption_ } from "^curated-pages/_containers/article-like";
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
      image: { aspectRatio, imageId, vertPosition },
    },
    { updateBodyImageAspectRatio },
  ] = ArticleImageSectionSlice.useContext();

  return (
    <Image_
      myImageProps={{ imageId: imageId!, vertPosition }}
      resizeImageProps={{
        aspectRatio,
        onAspectRatioChange: (aspectRatio) =>
          updateBodyImageAspectRatio({ aspectRatio }),
      }}
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
