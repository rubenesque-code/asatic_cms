/* eslint-disable jsx-a11y/alt-text */
import {
  ArrowBendLeftDown,
  ArrowBendRightUp,
  Image as ImageIcon,
} from "phosphor-react";
import { ReactElement } from "react";

import AddItemButton from "^components/buttons/AddItem";
import InlineTextEditor from "^components/editors/Inline";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ResizeImage from "^components/resize/Image";
import WithAddDocImageUnpopulated from "^components/WithAddDocImage";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { generateImgVertPositionProps } from "^helpers/image";
import ArticleBody from "./ArticleBody";
import ArticleUI from "./ArticleUI";

const WithAddDocImage = ({ children }: { children: ReactElement }) => {
  const [, { updateBodyImageSrc }] = ArticleImageSectionSlice.useContext();

  return (
    <WithAddDocImageUnpopulated
      onAddImage={(imageId) => updateBodyImageSrc({ imageId })}
    >
      {children}
    </WithAddDocImageUnpopulated>
  );
};

export default function ImageSection() {
  const [
    {
      image: { imageId },
    },
  ] = ArticleImageSectionSlice.useContext();

  return imageId ? <WithImage /> : <WithoutImage />;
}

function WithoutImage() {
  return (
    <ArticleUI.ImageSectionEmpty>
      <>
        <WithAddDocImage>
          <AddItemButton>Add Image</AddItemButton>
        </WithAddDocImage>
        <WithoutImage.Menu />
      </>
    </ArticleUI.ImageSectionEmpty>
  );
}

WithoutImage.Menu = function WithoutImageMenu() {
  const [, { removeBodySection }] = ArticleTranslationSlice.useContext();
  const [{ id: sectionId, index }] = ArticleImageSectionSlice.useContext();
  const [{ sectionHoveredIndex }] = ArticleBody.useContext();

  return (
    <ArticleUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    />
  );
};

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
    <ResizeImage
      aspectRatio={aspectRatio}
      onAspectRatioChange={(aspectRatio) => {
        updateBodyImageAspectRatio({ aspectRatio });
      }}
    >
      <MyImage imgId={imageId!} objectFit="cover" vertPosition={vertPosition} />
    </ResizeImage>
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
    <ArticleUI.ImageCaption>
      <InlineTextEditor
        injectedValue={caption}
        onUpdate={(caption) => updateBodyImageCaption({ caption })}
        placeholder="optional caption"
      />
    </ArticleUI.ImageCaption>
  );
};

WithImage.Menu = function WithImageMenu() {
  const [, { removeBodySection }] = ArticleTranslationSlice.useContext();
  const [{ sectionHoveredIndex }] = ArticleBody.useContext();
  const [
    {
      id: sectionId,
      image: {
        style: { vertPosition },
      },
      index,
    },
    { updateBodyImageVertPosition },
  ] = ArticleImageSectionSlice.useContext();

  const { canFocusHigher, canFocusLower, focusHigher, focusLower } =
    generateImgVertPositionProps(vertPosition, (vertPosition) =>
      updateBodyImageVertPosition({ vertPosition })
    );

  return (
    <ArticleUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    >
      <ContentMenu.Button
        onClick={focusLower}
        isDisabled={!canFocusLower}
        tooltipProps={{ text: "focus lower" }}
      >
        <ArrowBendLeftDown />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={focusHigher}
        isDisabled={!canFocusHigher}
        tooltipProps={{ text: "focus higher" }}
      >
        <ArrowBendRightUp />
      </ContentMenu.Button>
      <ContentMenu.VerticalBar />
      <WithAddDocImage>
        <ContentMenu.Button tooltipProps={{ text: "change image" }}>
          <ImageIcon />
        </ContentMenu.Button>
      </WithAddDocImage>
    </ArticleUI.SectionMenu>
  );
};
