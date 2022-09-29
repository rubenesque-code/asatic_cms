/* eslint-disable jsx-a11y/alt-text */
import { Image as ImageIcon } from "phosphor-react";

import WithAddDocImage from "^components/WithAddDocImage";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

import ArticleUI from "^components/article-like/entity-page/article/UI";
import {
  Image as ImageUnpopulated,
  Caption as CaptionUnpopulated,
  MenuButtons,
} from "^components/article-like/entity-page/article/ImageSection";
import SectionMenuGeneric from "./SectionMenuGeneric";

export default function ImageSection() {
  const [
    {
      image: { imageId },
    },
  ] = ArticleImageSectionSlice.useContext();

  return imageId ? <WithImage /> : <WithoutImage />;
}

function WithoutImage() {
  const [{ id: sectionId, index }, { updateBodyImageSrc }] =
    ArticleImageSectionSlice.useContext();

  return (
    <ArticleUI.SectionEmpty title="Image section">
      {(isHovered) => (
        <>
          <WithAddDocImage
            onAddImage={(imageId) => updateBodyImageSrc({ imageId })}
          >
            <ArticleUI.SectionEmptyButton text="Add image">
              <ImageIcon />
            </ArticleUI.SectionEmptyButton>
          </WithAddDocImage>
          <SectionMenuGeneric
            isShowing={isHovered}
            sectionId={sectionId}
            sectionIndex={index}
          />
        </>
      )}
    </ArticleUI.SectionEmpty>
  );
}

function WithImage() {
  return (
    <ArticleUI.ImageSection>
      <Image />
      <Caption />
      <WithImage.Menu />
    </ArticleUI.ImageSection>
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
    <ImageUnpopulated
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
    <CaptionUnpopulated
      caption={caption}
      updateCaption={(caption) => updateBodyImageCaption({ caption })}
    />
  );
};

WithImage.Menu = function WithImageMenu() {
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
      isShowing={true}
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
};
