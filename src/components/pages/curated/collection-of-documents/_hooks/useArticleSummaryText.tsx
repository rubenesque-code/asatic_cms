import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { getArticleLikeSummaryText } from "^helpers/article-like";

type UseArticleSummaryTextMaxCharactersArgs = {
  span: 1 | 2;
  ignoreDeclaredSpan?: boolean;
};

const useArticleSummaryTextMaxCharacters = ({
  span,
  ignoreDeclaredSpan = false,
}: UseArticleSummaryTextMaxCharactersArgs) => {
  const [{ summaryImage, authorsIds }] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();

  const isUsingImage = summaryImage.useImage && span === 2;

  const imageCharsEquivalent = !isUsingImage
    ? 0
    : span === 2 || ignoreDeclaredSpan
    ? 300
    : 150;

  const titleCharsEquivalentForColSpan2 =
    !title?.length || title.length < 30 ? 120 : (title.length / 30) * 60;
  const titleCharsEquivalent =
    span === 2
      ? titleCharsEquivalentForColSpan2
      : titleCharsEquivalentForColSpan2 / 2;

  const authorsCharsEquivalent = !authorsIds.length
    ? 0
    : span === 2 || ignoreDeclaredSpan
    ? 140
    : 70;

  const baseChars = span === 2 || ignoreDeclaredSpan ? 800 : 400;

  const maxCharsCalculated =
    baseChars -
    imageCharsEquivalent -
    titleCharsEquivalent -
    authorsCharsEquivalent;

  const maxChars = maxCharsCalculated > 200 ? maxCharsCalculated : 200;

  return maxChars;
};

export type UseArticleSummaryTextProps = UseArticleSummaryTextMaxCharactersArgs;

export const useArticleSummaryText = (
  maxCharArgs: UseArticleSummaryTextProps
) => {
  const [translation, { updateSummary }] = ArticleTranslationSlice.useContext();

  const text = getArticleLikeSummaryText(translation);

  const maxCharacters = useArticleSummaryTextMaxCharacters(maxCharArgs);

  const updateText = (summary: string) => updateSummary({ summary });

  return {
    maxCharacters,
    text,
    updateText,
  };
};
