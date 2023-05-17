/* eslint-disable jsx-a11y/alt-text */
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

import ContainerUtility from "^components/ContainerUtilities";
import {
  Caption_,
  Image_,
} from "^components/pages/curated/document/_containers/article-like";
import { $MediaSectionContainer_ } from "^components/pages/curated/document/_presentation/article-like";
import ResizeHeight from "^components/resize/ResizeImage";
import Menu from "./Menu";

const Populated = () => (
  <$MediaSectionContainer_
    menu={(containerIsHovered) => (
      <Menu isImage isShowing={containerIsHovered} />
    )}
  >
    <Image />
    <Caption />
  </$MediaSectionContainer_>
);

export default Populated;

const Image = () => {
  const [
    {
      image: { imageId, vertPosition, aspectRatio = 16 / 9 },
    },
    { updateBodyImageAspectRatio },
  ] = ArticleImageSectionSlice.useContext();

  return (
    <ContainerUtility.Width>
      {(width) => (
        <ResizeHeight
          height={width / aspectRatio}
          onResizeStop={(height) => {
            const aspectRatio = width / height;

            updateBodyImageAspectRatio({ aspectRatio });
          }}
        >
          <Image_
            myImageProps={{
              imageId: imageId!,
              vertPosition: vertPosition || 50,
            }}
          />
        </ResizeHeight>
      )}
    </ContainerUtility.Width>
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
