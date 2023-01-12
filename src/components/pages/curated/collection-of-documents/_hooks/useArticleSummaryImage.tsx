import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { getImageFromArticleBody } from "^helpers/article-like";

export type UseArticleSummaryImageArgs = {
  span: 1 | 2;
  ignoreDeclaredSpan?: boolean;
};

export const useArticleSummaryImage = ({
  span,
  ignoreDeclaredSpan = false,
}: UseArticleSummaryImageArgs) => {
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

  return {
    hideImage: span === 1 && !ignoreDeclaredSpan,
    props: {
      actions: {
        toggleUseImage: toggleUseSummaryImage,
        updateImageSrc: (imageId: string) => updateSummaryImageSrc({ imageId }),
        updateVertPosition: (vertPosition: number) =>
          updateSummaryImageVertPosition({ vertPosition }),
      },
      data: {
        imageId,
        vertPosition: summaryImage.vertPosition || 50,
        isUsingImage: summaryImage.useImage,
      },
    },
  };
};
