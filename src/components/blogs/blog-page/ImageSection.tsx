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
import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { generateImgVertPositionProps } from "^helpers/image";
import Body from "./Body";
import BlogUI from "./BlogUI";

const WithAddDocImage = ({ children }: { children: ReactElement }) => {
  const [, { updateBodyImageSrc }] = BlogImageSectionSlice.useContext();

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
  ] = BlogImageSectionSlice.useContext();

  return imageId ? <WithImage /> : <WithoutImage />;
}

function WithoutImage() {
  return (
    <BlogUI.ImageSectionEmpty>
      <>
        <WithAddDocImage>
          <AddItemButton>Add Image</AddItemButton>
        </WithAddDocImage>
        <WithoutImage.Menu />
      </>
    </BlogUI.ImageSectionEmpty>
  );
}

WithoutImage.Menu = function WithoutImageMenu() {
  const [, { removeBodySection }] = BlogTranslationSlice.useContext();
  const [{ id: sectionId, index }] = BlogImageSectionSlice.useContext();
  const [{ sectionHoveredIndex }] = Body.useContext();

  return (
    <BlogUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    />
  );
};

function WithImage() {
  return (
    <BlogUI.ImageSection>
      <Image />
      <Caption />
      <WithImage.Menu />
    </BlogUI.ImageSection>
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
  ] = BlogImageSectionSlice.useContext();

  return (
    <BlogUI.ImageCaption>
      <InlineTextEditor
        injectedValue={caption}
        onUpdate={(caption) => updateBodyImageCaption({ caption })}
        placeholder="optional caption"
      />
    </BlogUI.ImageCaption>
  );
};

WithImage.Menu = function WithImageMenu() {
  const [, { removeBodySection }] = BlogTranslationSlice.useContext();
  const [{ sectionHoveredIndex }] = Body.useContext();
  const [
    {
      id: sectionId,
      image: {
        style: { vertPosition },
      },
      index,
    },
    { updateBodyImageVertPosition },
  ] = BlogImageSectionSlice.useContext();

  const { canFocusHigher, canFocusLower, focusHigher, focusLower } =
    generateImgVertPositionProps(vertPosition, (vertPosition) =>
      updateBodyImageVertPosition({ vertPosition })
    );

  return (
    <BlogUI.SectionMenu
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
    </BlogUI.SectionMenu>
  );
};
