/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import {
  getArticleSummaryFromTranslation,
  getImageFromArticleBody,
} from "^helpers/article-like";

import { Title_, Authors_, Text_, Image_ } from "../../../_containers/Entity";

const ArticleSummary = () => {
  return (
    <>
      <Image />
      <Title />
      <Authors />
      <Text />
    </>
  );
};

export default ArticleSummary;

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ color="cream" title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  return <Authors_ authorIds={authorsIds} docActiveLanguageId={languageId} />;
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
      imageId={imageId}
      summaryImage={summaryImage}
      updateImageSrc={(imageId: string) => updateSummaryImageSrc({ imageId })}
      updateVertPosition={(vertPosition: number) =>
        updateSummaryImageVertPosition({ vertPosition })
      }
      toggleUseImage={toggleUseSummaryImage}
    />
  );
};
