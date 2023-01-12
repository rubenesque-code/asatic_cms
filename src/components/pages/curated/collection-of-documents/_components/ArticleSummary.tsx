/* eslint-disable jsx-a11y/alt-text */
import { ReactElement } from "react";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import {
  getArticleLikeSummaryText,
  getImageFromArticleBody,
} from "^helpers/article-like";

import {
  Authors_,
  Image_,
  ArticleLikeMenu_,
  Status_,
  Text_,
  Title_,
} from "../_containers/summary";

export const Menu = ({
  children,
  isShowing,
}: {
  children: ReactElement;
  isShowing: boolean;
}) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <ArticleLikeMenu_
      isShowing={isShowing}
      routeToEntityPage={routeToEditPage}
      toggleUseImageOn={toggleUseSummaryImage}
      usingImage={Boolean(summaryImage.useImage)}
    >
      {children}
    </ArticleLikeMenu_>
  );
};

export const Image = () => {
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
      actions={{
        updateImageSrc: (imageId) => updateSummaryImageSrc({ imageId }),
        updateVertPosition: (vertPosition) =>
          updateSummaryImageVertPosition({ vertPosition }),
        toggleUseImage: toggleUseSummaryImage,
      }}
      data={{
        vertPosition: summaryImage.vertPosition || 50,
        imageId,
        isUsingImage: summaryImage.useImage,
      }}
    />
  );
};

export const Text = ({ maxCharacters }: { maxCharacters: number }) => {
  const [translation, { updateSummary }] = ArticleTranslationSlice.useContext();

  const text = getArticleLikeSummaryText(translation);

  return (
    <Text_
      maxCharacters={maxCharacters}
      text={text}
      updateSummary={(summary) => updateSummary({ summary })}
    />
  );
};

export const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  return <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />;
};

export const Status = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

export const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ title={title} />;
};
