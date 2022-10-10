/* eslint-disable jsx-a11y/alt-text */
import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";

import ImageSection from "^components/article-like/entity-page/article/ImageSection";
import MediaSection from "^components/display-entity/entity-page/article/MediaSection";
import MenuButtons from "^components/display-entity/image/MenuButtons";

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
  ] = BlogImageSectionSlice.useContext();

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
  ] = BlogImageSectionSlice.useContext();

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
  ] = BlogImageSectionSlice.useContext();

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
