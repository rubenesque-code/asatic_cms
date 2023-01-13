/* eslint-disable jsx-a11y/alt-text */
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import $CardContainer from "../_presentation/$CardContainer_";

import {
  getArticleLikeSummaryText,
  getImageFromArticleLikeBody,
} from "^helpers/article-like";

import {
  Status_,
  Title_,
  Authors_,
  Image_,
} from "^components/pages/curated/_containers/entity-summary";
import Menu from "./Menu";
import {
  $status,
  $articleLikeImageContainer,
  $Title,
  $authors,
} from "../_styles";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";
import { Text_ } from "^curated-pages/_containers/entity-summary";

export type CardProps = TextProps;

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
    { summaryImage },
    {
      toggleUseSummaryImage,
      updateSummaryImageSrc,
      updateSummaryImageVertPosition,
    },
  ] = BlogSlice.useContext();
  const [{ body }] = BlogTranslationSlice.useContext();

  const imageId = summaryImage.imageId || getImageFromArticleLikeBody(body);

  return (
    <Image_
      containerStyles={$articleLikeImageContainer}
      actions={{
        toggleUseImage: toggleUseSummaryImage,
        updateImageSrc: (imageId) => updateSummaryImageSrc({ imageId }),
        updateVertPosition: (vertPosition) =>
          updateSummaryImageVertPosition({ vertPosition }),
      }}
      data={{
        imageId,
        vertPosition: summaryImage.vertPosition || 50,
        isUsingImage: summaryImage.useImage,
        aspectRatio: 16 / 9,
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

type TextProps = {
  declaredSpan: 1 | 2;
  ignoreDeclaredSpan: boolean;
};

const Text = () => {
  const [{ summaryImage, authorsIds }] = BlogSlice.useContext();
  const [translation, { updateSummary }] = BlogTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);
  const usingImage = summaryImage.useImage;

  const summary = getArticleLikeSummaryText(translation);

  const [{ changeSpanIsDisabled, width: declaredSpan }] =
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
    <Text_
      maxChars={maxChars}
      text={summary}
      updateSummary={(summary) => updateSummary({ summary })}
    />
  );
};
