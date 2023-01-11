/* eslint-disable jsx-a11y/alt-text */
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

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
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

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
  const [{ status, publishDate }] = BlogSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

const Image = () => {
  const [
    { summaryImage, landingCustomSectionImage },
    {
      toggleUseSummaryImage,
      updateLandingCustomImageAspectRatio,
      updateLandingCustomImageVertPosition,
      updateSummaryImageSrc,
    },
  ] = BlogSlice.useContext();
  const [{ body }] = BlogTranslationSlice.useContext();

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
  const [{ title }] = BlogTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ languageId }] = BlogTranslationSlice.useContext();

  return (
    <Authors_
      activeLanguageId={languageId}
      authorsIds={authorsIds}
      styles={$authors}
    />
  );
};

const Text = () => {
  const [{ summaryImage, authorsIds }] = BlogSlice.useContext();
  const [translation, { updateDefaultSummary: updateLandingAutoSummary }] =
    BlogTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);
  const usingImage = summaryImage.useImage;

  const summary = getArticleSummaryFromTranslation(
    translation,
    "landing-user-section"
  );

  const [{ width: declaredSpan, changeSpanIsDisabled }] =
    LandingCustomSectionComponentSlice.useContext();

  const imageCharsEquivalent =
    declaredSpan === 2 || changeSpanIsDisabled ? 300 : 150;
  const authorsCharsEquivalent =
    declaredSpan === 2 || changeSpanIsDisabled ? 140 : 70;

  const baseChars = declaredSpan === 2 || changeSpanIsDisabled ? 800 : 400;

  const maxChars =
    baseChars -
    (usingImage ? imageCharsEquivalent : 0) -
    (isAuthor ? authorsCharsEquivalent : 0);

  return (
    <$Text>
      <SummaryText_
        numChars={maxChars}
        text={summary}
        updateText={(summary) => updateLandingAutoSummary({ summary })}
      />
    </$Text>
  );
};
