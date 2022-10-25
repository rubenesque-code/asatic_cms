/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import {
  getArticleSummaryFromTranslation,
  getImageFromArticleBody,
} from "^helpers/article-like";

import { Text_ } from "../../../_containers/Entity_";
import {
  Image_,
  Authors_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary";
import { $imageContainer, $authors, $Title } from "../../../_styles/entity";

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
  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <$Title color="cream">
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
  const [translation, { updateLandingAutoSummary }] =
    ArticleTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);
  const usingImage = summaryImage.useImage;

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const numChars =
    isAuthor && usingImage ? 110 : usingImage ? 150 : isAuthor ? 200 : 240;

  return (
    <Text_
      numChars={numChars}
      text={summary}
      updateEntityAutoSectionSummary={(summary) =>
        updateLandingAutoSummary({ summary })
      }
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
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

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
