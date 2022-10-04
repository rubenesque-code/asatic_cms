import { JSONContent } from "@tiptap/core";
import { Trash, FileText } from "phosphor-react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import useFindDocsUsedInCustomLandingSections from "^hooks/useFindDocsUsedInCustomLandingSections";

import { landingColorThemes } from "^data/landing";

import { arrayDivergence, mapIds } from "^helpers/general";
import {
  getArticleSummaryFromTranslation,
  getFirstImageFromArticleBody,
  selectTranslationForActiveLanguage,
} from "^helpers/article";
import { generateImgVertPositionProps } from "^helpers/image";

import EditImagePopover from "../EditImagePopover";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import DivHover from "^components/DivHover";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ImageMenuUI from "^components/menus/Image";
import MissingText from "^components/MissingText";
import SiteLanguage from "^components/SiteLanguage";

import AutoSection from ".";
import Swiper from "./Swiper";
import StatusLabel from "^components/StatusLabel";

export default function Articles() {
  return (
    <AutoSection.Container
      colorTheme="cream"
      swiper={<ArticlesSwiper />}
      title="Articles"
      moreFromText="More from articles"
    />
  );
}

const ArticlesSwiper = () => {
  const articles = useSelector(selectArticles);

  const usedArticlesIds = useFindDocsUsedInCustomLandingSections("article");
  const articlesIds = [...new Set(mapIds(articles))];
  const unusedArticlesIds = arrayDivergence(articlesIds, usedArticlesIds);

  const articlesOrderedIds = [...unusedArticlesIds, ...usedArticlesIds];
  const articlesOrdered = articlesOrderedIds.map(
    (id) => articles.find((a) => a.id === id)!
  );

  // could order by date + translation (for site language)

  return (
    <Swiper
      colorTheme="cream"
      elements={articlesOrdered.map((article) => (
        <ArticleSlice.Provider article={article} key={article.id}>
          <Article />
        </ArticleSlice.Provider>
      ))}
    />
  );
};

function Article() {
  const [{ id: articleId, translations }] = ArticleSlice.useContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForActiveLanguage(
    translations,
    siteLanguageId
  );

  return (
    <ArticleTranslationSlice.Provider
      translation={translation}
      articleId={articleId}
    >
      <DivHover styles={tw`h-full`}>
        {(isHovered) => (
          <>
            <Swiper.Element>
              <ArticleContent />
            </Swiper.Element>
            <ArticleMenu articleIsHovered={isHovered} />
          </>
        )}
      </DivHover>
    </ArticleTranslationSlice.Provider>
  );
}

const ArticleMenu = ({ articleIsHovered }: { articleIsHovered: boolean }) => {
  const [
    {
      summaryImage: { useImage, imageId },
    },
    { toggleUseLandingImage, updateLandingImageSrc, routeToEditPage },
  ] = ArticleSlice.useContext();

  const onSelectImage = (imageId: string) => {
    if (!useImage) {
      toggleUseLandingImage();
    }
    updateLandingImageSrc({ imageId });
  };

  const show = (!useImage || !imageId) && articleIsHovered;

  return (
    <ContentMenu show={show} styles={tw`top-0 right-0`}>
      {!useImage ? (
        <>
          <EditImagePopover
            onSelectImage={onSelectImage}
            tooltipText="add image"
          />
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{
          text: "go to edit page",
          placement: "left",
          type: "action",
        }}
      >
        <FileText />
      </ContentMenu.Button>
    </ContentMenu>
  );
};

function ArticleContent() {
  const [{ publishDate, status }] = ArticleSlice.useContext();
  return (
    <>
      <div css={[tw`inline-block mb-sm`]}>
        <StatusLabel publishDate={publishDate} status={status} />
      </div>
      <ArticleImage />
      <ArticleTitle />
      <ArticleAuthors />
      <ArticleSummary />
    </>
  );
}

function ArticleTitle() {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <h3 css={[tw`text-3xl`, landingColorThemes.cream.text]}>
      {title ? (
        title
      ) : (
        <div css={[tw`flex items-baseline gap-xs`]}>
          <span css={[tw`text-gray-placeholder`]}>Title...</span>
          <MissingText tooltipText="missing title" fontSize={tw`text-base`} />
        </div>
      )}
    </h3>
  );
}

const ArticleImage = () => {
  const [
    {
      summaryImage: {
        imageId: summaryImageId,
        autoSection: { imgVertPosition },
        useImage,
      },
    },
  ] = ArticleSlice.useContext();

  const [{ body }] = ArticleTranslationSlice.useContext();

  const imageIdFromBody = getFirstImageFromArticleBody(body);

  const imageId = summaryImageId
    ? summaryImageId
    : imageIdFromBody
    ? imageIdFromBody
    : null;

  return useImage && imageId ? (
    <DivHover styles={tw`w-full aspect-ratio[16 / 9] mb-sm`}>
      {(isHovered) => (
        <>
          <MyImage
            imgId={imageId}
            objectFit="cover"
            vertPosition={imgVertPosition}
          />
          <ArticleImageMenu show={isHovered} />
        </>
      )}
    </DivHover>
  ) : null;
};

const ArticleImageMenu = ({ show }: { show: boolean }) => {
  const [
    {
      summaryImage: {
        autoSection: { imgVertPosition },
      },
    },
    {
      toggleUseLandingImage,
      updateLandingAutoSectionImageVertPosition,
      updateLandingImageSrc,
    },
  ] = ArticleSlice.useContext();

  const imgVertPositionProps = generateImgVertPositionProps(
    imgVertPosition,
    (imgVertPosition) =>
      updateLandingAutoSectionImageVertPosition({ imgVertPosition })
  );

  return (
    <ImageMenuUI
      containerStyles={tw`absolute right-0 top-0`}
      {...imgVertPositionProps}
      show={show}
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

const ArticleAuthors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <div css={[tw`text-2xl text-articleText mt-xxxs`]}>
      <DocAuthorsText authorIds={authorsIds} docActiveLanguageId={languageId} />
    </div>
  );
};

// todo: diff in line heights between summary written manually and that from article body

const ArticleSummary = () => {
  const [
    {
      summaryImage: { useImage, imageId },
      authorsIds,
    },
  ] = ArticleSlice.useContext();

  const isImage = useImage && imageId;
  const isAuthor = authorsIds.length;

  const [translation, { updateLandingAutoSummary }] =
    ArticleTranslationSlice.useContext();

  const initialContent =
    getArticleSummaryFromTranslation(translation, "auto") || undefined;

  const onUpdate = (text: JSONContent) =>
    updateLandingAutoSummary({
      summary: text,
      // summaryType: "auto",
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
