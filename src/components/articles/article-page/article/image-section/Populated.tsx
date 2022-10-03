/* eslint-disable jsx-a11y/alt-text */
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

import ImageSection from "^components/article-like/entity-page/article/ImageSection";
import MediaSection from "^components/display-content/entity-page/article/MediaSection";
import MenuButtons from "^components/display-content/image/MenuButtons";

import SectionMenuGeneric from "../SectionMenuGeneric";

export default function Populated() {
  return (
    <MediaSection>
      {(isHovered) => (
        <>
          <Image />
          <Caption />
          <Menu isShowing={isHovered} />
        </>
      )}
    </MediaSection>
  );
}

const Image = () => {
  const [
    {
      image: {
        imageId,
        style: { aspectRatio, vertPosition },
      },
    },
    { updateBodyImageAspectRatio },
  ] = ArticleImageSectionSlice.useContext();

  return (
    <ImageSection.Image
      aspectRatio={aspectRatio}
      imageId={imageId!}
      updateAspectRatio={(aspectRatio) =>
        updateBodyImageAspectRatio({ aspectRatio })
      }
      vertPosition={vertPosition}
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
    <MediaSection.Caption
      caption={caption}
      updateCaption={(caption) => updateBodyImageCaption({ caption })}
    />
  );
};

function Menu({ isShowing }: { isShowing: boolean }) {
  const [
    {
      id: sectionId,
      image: {
        style: { vertPosition },
      },
      index: sectionIndex,
    },
    { updateBodyImageVertPosition, updateBodyImageSrc },
  ] = ArticleImageSectionSlice.useContext();

  return (
    <SectionMenuGeneric
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
    >
      <MenuButtons
        updateImageSrc={(imageId) => updateBodyImageSrc({ imageId })}
        updateVertPosition={(vertPosition) =>
          updateBodyImageVertPosition({ vertPosition })
        }
        vertPosition={vertPosition}
      />
    </SectionMenuGeneric>
  );
}
