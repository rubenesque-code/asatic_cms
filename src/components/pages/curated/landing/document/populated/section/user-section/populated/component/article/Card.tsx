/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import $CardContainer from "../_presentation/$CardContainer_";

import {
  getArticleSummaryFromTranslation,
  getImageFromArticleBody,
} from "^helpers/article-like";

import {
  Status_,
  Title_,
  Authors_,
  Image_,
} from "^components/pages/curated/_containers/entity-summary";
import { SummaryText_ } from "^components/pages/curated/_containers/article-like";
import Menu from "./Menu";
import {
  $status,
  $articleLikeImageContainer,
  $Title,
  $authors,
  $Text,
} from "../_styles";

const Card = () => {
  return (
    <$CardContainer>
      {(isHovered) => (
        <>
          <Status />
          <Image />
          <Title />
          <Authors />
          <Text />
          <Menu isShowing={isHovered} />
        </>
      )}
    </$CardContainer>
  );
};

export default Card;

const Status = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

const Image = () => {
  const [
    { summaryImage, landingCustomSectionImage },
    {
      toggleUseSummaryImage,
      updateLandingCustomImageAspectRatio,
      updateSummaryImageSrc,
      updateLandingCustomImageVertPosition,
    },
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  const imageId = summaryImage.imageId || getImageFromArticleBody(body);

  return (
    <Image_
      containerStyles={$articleLikeImageContainer}
      actions={{
        toggleUseImage: toggleUseSummaryImage,
        updateAspectRatio: (aspectRatio) =>
          updateLandingCustomImageAspectRatio({ aspectRatio }),
        updateImageSrc: (imageId) => updateSummaryImageSrc({ imageId }),
        updateVertPosition: (vertPosition) =>
          updateLandingCustomImageVertPosition({ vertPosition }),
      }}
      data={{
        imageId,
        vertPosition: landingCustomSectionImage.vertPosition || 50,
        isUsingImage: summaryImage.useImage,
        aspectRatio: landingCustomSectionImage.aspectRatio || 16 / 9,
      }}
    />
  );
};

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  return (
    <Authors_
      activeLanguageId={languageId}
      authorsIds={authorsIds}
      styles={$authors}
    />
  );
};

const Text = () => {
  const [{ summaryImage, authorsIds }] = ArticleSlice.useContext();
  const [translation, { updateLandingCustomSummary }] =
    ArticleTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);
  const usingImage = summaryImage.useImage;

  const summary = getArticleSummaryFromTranslation(
    translation,
    "landing-user-section"
  );

  const numChars =
    isAuthor && usingImage ? 110 : usingImage ? 150 : isAuthor ? 200 : 240;

  return (
    <$Text>
      <SummaryText_
        numChars={numChars}
        text={summary}
        updateText={(summary) => updateLandingCustomSummary({ summary })}
      />
    </$Text>
  );
};
