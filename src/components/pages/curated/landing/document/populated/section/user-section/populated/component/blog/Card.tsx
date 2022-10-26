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
import { Text_ } from "^components/pages/curated/_containers/article-like";
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
  const [{ status, publishDate }] = BlogSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

const Image = () => {
  const [
    { summaryImage, landingCustomSection },
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
        vertPosition: landingCustomSection.imgVertPosition || 50,
        isUsingImage: summaryImage.useImage,
        aspectRatio: landingCustomSection.imgAspectRatio,
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
  const [translation, { updateLandingAutoSummary }] =
    BlogTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);
  const usingImage = summaryImage.useImage;

  const summary = getArticleSummaryFromTranslation(translation, "user");

  const numChars =
    isAuthor && usingImage ? 110 : usingImage ? 150 : isAuthor ? 200 : 240;

  return (
    <$Text>
      <Text_
        numChars={numChars}
        text={summary}
        updateText={(summary) => updateLandingAutoSummary({ summary })}
      />
    </$Text>
  );
};
