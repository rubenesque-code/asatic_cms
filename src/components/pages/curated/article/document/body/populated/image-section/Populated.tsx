/* eslint-disable jsx-a11y/alt-text */
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

import { $MediaSectionContainer_ } from "../../../../../_presentation/article-like";
import {
  ImageSectionPopulatedMenu_,
  Image_,
  Caption_,
} from "../../../../../_containers/article-like";

const Populated = () => {
  const [
    {
      id: sectionId,
      index: sectionIndex,
      image: {
        style: { vertPosition },
      },
    },
    { updateBodyImageSrc, updateBodyImageVertPosition },
  ] = ArticleImageSectionSlice.useContext();

  return (
    <$MediaSectionContainer_
      menu={(containerIsHovered) => (
        <ImageSectionPopulatedMenu_
          imageButtonsProps={{
            updateImageSrc: (imageId) => updateBodyImageSrc({ imageId }),
            updateVertPosition: (vertPosition) =>
              updateBodyImageVertPosition({ vertPosition }),
            vertPosition,
          }}
          sectionMenuProps={{
            isShowing: containerIsHovered,
            sectionId,
            sectionIndex,
          }}
        />
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
      image: {
        imageId,
        style: { vertPosition, aspectRatio },
      },
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
  const [
    {
      image: { caption },
    },
    { updateBodyImageCaption },
  ] = ArticleImageSectionSlice.useContext();

  return (
    <Caption_
      caption={caption}
      updateCaption={(caption) => updateBodyImageCaption({ caption })}
    />
  );
};
