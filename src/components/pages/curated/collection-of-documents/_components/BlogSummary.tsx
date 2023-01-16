/* eslint-disable jsx-a11y/alt-text */
import { ReactElement } from "react";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import {
  getArticleLikeSummaryText,
  getImageFromArticleLikeBody,
} from "^helpers/article-like";

import {
  Authors_,
  Image_,
  ArticleLikeMenu_,
  Status_,
  Text_,
  Title_,
  Date_,
} from "../_containers/summary";

export const Menu = ({
  children,
  isShowing,
  imageIsToggleable = true,
}: {
  children: ReactElement;
  isShowing: boolean;
  imageIsToggleable?: boolean;
}) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    BlogSlice.useContext();

  return (
    <ArticleLikeMenu_
      isShowing={isShowing}
      routeToEntityPage={routeToEditPage}
      toggleUseImageOn={imageIsToggleable ? toggleUseSummaryImage : null}
      usingImage={Boolean(summaryImage.useImage)}
    >
      {children}
    </ArticleLikeMenu_>
  );
};

export const Image = ({ imageOverride }: { imageOverride?: "always-show" }) => {
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
      actions={{
        updateImageSrc: (imageId) => updateSummaryImageSrc({ imageId }),
        updateVertPosition: (vertPosition) =>
          updateSummaryImageVertPosition({ vertPosition }),
        toggleUseImage: imageOverride ? null : toggleUseSummaryImage,
      }}
      data={{
        vertPosition: summaryImage.vertPosition || 50,
        imageId,
        isUsingImage: imageOverride ? true : summaryImage.useImage,
      }}
    />
  );
};

export const Text = ({ maxCharacters }: { maxCharacters: number }) => {
  const [translation, { updateSummary }] = BlogTranslationSlice.useContext();

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
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ languageId }] = BlogTranslationSlice.useContext();

  return <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />;
};

export const Date = () => {
  const [{ publishDate }] = BlogSlice.useContext();
  const [{ languageId }] = BlogTranslationSlice.useContext();

  return <Date_ publishDate={publishDate} languageId={languageId} />;
};

export const Status = () => {
  const [{ status, publishDate }] = BlogSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

export const Title = () => {
  const [{ title }] = BlogTranslationSlice.useContext();

  return <Title_ title={title} />;
};
