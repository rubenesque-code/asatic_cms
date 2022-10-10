/* eslint-disable jsx-a11y/alt-text */
import { JSONContent } from "@tiptap/core";
import { Trash, WarningCircle, Image as ImageIcon } from "phosphor-react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import {
  getArticleSummaryFromTranslation,
  getFirstImageFromArticleBody,
  selectTranslationForActiveLanguage,
} from "^helpers/article";
import { generateImgVertPositionProps } from "^helpers/image";

import ContainerUtility from "^components/ContainerUtilities";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ImageMenuUI from "^components/menus/Image";
import ResizeImage from "^components/resize/Image";
import SiteLanguage from "^components/SiteLanguage";
import WithAddDocImage from "^components/WithAddDocImage";

import { ComponentMenu } from ".";

const Blog = () => {
  const [{ docId }] = LandingCustomSectionComponentSlice.useContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const blog = useSelector((state) => selectBlogById(state, docId));

  return blog ? (
    <BlogSlice.Provider blog={blog}>
      <BlogTranslationSlice.Provider
        blogId={blog.id}
        translation={selectTranslationForActiveLanguage(
          blog.translations,
          siteLanguageId
        )}
      >
        <BlogFound />
      </BlogTranslationSlice.Provider>
    </BlogSlice.Provider>
  ) : (
    <BlogMissing />
  );
};

export default Blog;

const BlogMissing = () => {
  return (
    <div
      css={[
        tw`relative p-md border-2 border-red-warning h-full grid place-items-center`,
      ]}
    >
      <div css={[tw`text-center`]}>
        <h4 css={[tw`font-medium flex items-center justify-center gap-xs`]}>
          <span css={[tw`text-red-warning`]}>
            <WarningCircle weight="bold" />
          </span>
          Missing blog
        </h4>
        <p css={[tw`mt-sm text-sm text-gray-700`]}>
          This component references an blog that couldn&apos;t be found. <br />{" "}
          It has probably been deleted by a user, but you can try refreshing the
          page.
        </p>
      </div>
    </div>
  );
};

const BlogFound = () => {
  return (
    <ContainerUtility.isHovered styles={tw`relative pb-lg min-h-full`}>
      {(isHovered) => (
        <>
          <Image />
          <div css={[tw`px-sm mt-md`]}>
            <Title />
            <Summary />
          </div>
          <BlogMenu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

const BlogMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      landingImage: { useImage, imageId: landingImageId },
    },
    { toggleUseLandingImage, updateLandingImageSrc },
  ] = BlogSlice.useContext();
  const [{ body }] = BlogTranslationSlice.useContext();
  const bodyImageId = getFirstImageFromArticleBody(body);

  const isImage = landingImageId || bodyImageId;

  return (
    <ComponentMenu isShowing={isShowing}>
      <>
        {!useImage ? (
          <>
            <ContentMenu.VerticalBar />
            {isImage ? (
              <ContentMenu.Button
                onClick={toggleUseLandingImage}
                tooltipProps={{ text: "use image" }}
              >
                <ImageIcon />
              </ContentMenu.Button>
            ) : (
              <WithAddDocImage
                onAddImage={(imageId) => updateLandingImageSrc({ imageId })}
              >
                <ContentMenu.Button tooltipProps={{ text: "add image" }}>
                  <ImageIcon />
                </ContentMenu.Button>
              </WithAddDocImage>
            )}
          </>
        ) : null}
      </>
    </ComponentMenu>
  );
};

const Image = () => {
  const [
    {
      landingImage: {
        imageId: landingImageId,
        useImage: useLandingImage,
        customSection: { imgAspectRatio, imgVertPosition },
      },
    },
    { updateLandingCustomSectionImageAspectRatio },
  ] = BlogSlice.useContext();
  const [{ body }] = BlogTranslationSlice.useContext();

  const bodyImageId = getFirstImageFromArticleBody(body);

  if (!useLandingImage) {
    return null;
  }

  const imageId = landingImageId
    ? landingImageId
    : bodyImageId
    ? bodyImageId
    : null;

  if (!imageId) {
    return null;
  }

  return (
    <ContainerUtility.isHovered styles={tw`px-xs pt-xs`}>
      {(isHovered) => (
        <ResizeImage
          aspectRatio={imgAspectRatio}
          onAspectRatioChange={(imgAspectRatio) =>
            updateLandingCustomSectionImageAspectRatio({ imgAspectRatio })
          }
        >
          <>
            <MyImage
              imgId={imageId}
              objectFit="cover"
              vertPosition={imgVertPosition}
            />
            <ImageMenu isShowing={isHovered} />
          </>
        </ResizeImage>
      )}
    </ContainerUtility.isHovered>
  );
};

const ImageMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    {
      landingImage: {
        customSection: { imgVertPosition },
      },
    },
    {
      toggleUseLandingImage,
      updateLandingCustomSectionImageVertPosition,
      updateLandingImageSrc,
    },
  ] = BlogSlice.useContext();

  const imgVertPositionProps = generateImgVertPositionProps(
    imgVertPosition,
    (imgVertPosition) =>
      updateLandingCustomSectionImageVertPosition({ imgVertPosition })
  );

  return (
    <ImageMenuUI
      containerStyles={tw`absolute right-0 top-5`}
      {...imgVertPositionProps}
      show={isShowing}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
      additionalButtons={
        <>
          <ContentMenu.VerticalBar />
          <ContentMenu.ButtonWithWarning
            tooltipProps={{ text: "remove image", type: "action" }}
            warningProps={{
              callbackToConfirm: toggleUseLandingImage,
              warningText: "Remove image?",
              type: "moderate",
            }}
          >
            <Trash />
          </ContentMenu.ButtonWithWarning>
        </>
      }
    />
  );
};

const Title = () => {
  const [{ title }] = BlogTranslationSlice.useContext();

  return (
    <h3 css={[tw`text-3xl font-serif-eng`]}>
      {title ? (
        title
      ) : (
        <div css={[tw`flex items-center gap-sm`]}>
          <span css={[tw`text-gray-placeholder`]}>title...</span>
        </div>
      )}
    </h3>
  );
};

const Summary = () => {
  const [
    {
      landingImage: { useImage, imageId },
      authorsIds,
    },
  ] = BlogSlice.useContext();

  const isImage = useImage && imageId;
  const isAuthor = authorsIds.length;

  const [translation, { updateLandingAutoSummary }] =
    BlogTranslationSlice.useContext();

  const initialContent =
    getArticleSummaryFromTranslation(translation, "user") || undefined;

  const onUpdate = (text: JSONContent) =>
    updateLandingAutoSummary({
      summary: text,
    });

  return (
    <div css={[tw`relative text-articleText mt-xs`]}>
      <SimpleTipTapEditor
        initialContent={initialContent}
        onUpdate={onUpdate}
        placeholder="summary here..."
        lineClamp={
          isImage && isAuthor
            ? "line-clamp-4"
            : isImage
            ? "line-clamp-6"
            : isAuthor
            ? "line-clamp-7"
            : "line-clamp-9"
        }
        key={translation.id}
      />
    </div>
  );
};
