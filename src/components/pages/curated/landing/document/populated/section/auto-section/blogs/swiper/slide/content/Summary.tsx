/* eslint-disable jsx-a11y/alt-text */
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import {
  getArticleSummaryFromTranslation,
  getImageFromArticleBody,
} from "^helpers/article-like";

import {
  Image_,
  Authors_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary";
import { Text_ } from "^components/pages/curated/_containers/article-like";
import { $imageContainer, $authors, $Title } from "../../../../_styles/entity";

const Summary = () => {
  return (
    <>
      <Image />
      <Title />
      <Authors />
      <Text />
    </>
  );
};

export default Summary;

const Title = () => {
  const [{ title }] = BlogTranslationSlice.useContext();

  return (
    <$Title color="blue">
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

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const numChars =
    isAuthor && usingImage ? 110 : usingImage ? 150 : isAuthor ? 200 : 240;

  return (
    <Text_
      numChars={numChars}
      text={summary}
      updateText={(summary) => updateLandingAutoSummary({ summary })}
    />
  );
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

  const imageId = summaryImage.imageId || getImageFromArticleBody(body);

  return (
    <Image_
      containerStyles={$imageContainer}
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
      }}
    />
  );
};
