/* eslint-disable jsx-a11y/alt-text */
import {
  ArrowBendLeftDown,
  ArrowBendRightUp,
  Image as ImageIcon,
  Plus,
} from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import InlineTextEditor from "^components/editors/Inline";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ResizeImage from "^components/resize/Image";
import WithAddDocImageUnpopulated from "^components/WithAddDocImage";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import { generateImgVertPositionProps } from "^helpers/image";
import ArticleBody, { SectionMenu } from "./ArticleBody";
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
          <div css={[tw`flex items-center gap-xs cursor-pointer`]}>
            <div css={[tw`relative text-gray-300`]}>
              <span css={[tw`text-3xl`]}>
                <ImageIcon />
              </span>
              <span css={[tw`absolute -bottom-0.5 -right-1 bg-white`]}>
                <Plus />
              </span>
            </div>
            <p css={[tw`text-gray-600`]}>Add image</p>
          </div>
        </WithAddDocImage>
        <WithoutImage.Menu />
      </>
    </ArticleUI.ImageSectionEmpty>
  );
}

WithoutImage.Menu = function WithoutImageMenu() {
  const [{ id: sectionId, index }] = ArticleImageSectionSlice.useContext();
  const [{ sectionHoveredIndex }] = ArticleBody.useContext();

  return (
    <SectionMenu
      isShowing={sectionHoveredIndex === index}
      sectionId={sectionId}
      sectionIndex={index}
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
    <SectionMenu
      isShowing={index === sectionHoveredIndex}
      sectionId={sectionId}
      sectionIndex={index}
    >
      <>
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
      </>
    </SectionMenu>
  );
};
