import { useCustomSectionComponentContext } from "^context/CustomSectionComponentContext";
import { ArticleLikeEntity } from "^types/article-like-entity";

export const useArticleLikeSummaryText = ({
  authorsIds,
  summaryImage,
  title,
}: {
  summaryImage: ArticleLikeEntity<"article" | "blog">["summaryImage"];
  authorsIds: string[];
  title?: string;
}) => {
  const {
    imageOverride: showImageOverride,
    colSpan,
    rowSpan,
  } = useCustomSectionComponentContext();

  const isUsingImage = !showImageOverride && summaryImage.useImage;
  const imageCharsEquivalent =
    !isUsingImage || (colSpan === "1/2" && rowSpan === 2)
      ? 0
      : colSpan === "1/2"
      ? 300
      : 150;

  const titleCharsEquivalentForColSpan2 =
    !title?.length || title.length < 30 ? 120 : (title.length / 30) * 60;
  const titleCharsEquivalent =
    colSpan === "1/2"
      ? titleCharsEquivalentForColSpan2
      : titleCharsEquivalentForColSpan2 / 2;

  const authorsCharsEquivalent = !authorsIds.length
    ? 0
    : colSpan === "1/2"
    ? 140
    : 70;

  const baseChars = colSpan === "1/2" ? 600 : 300;

  const maxCharsCalculated =
    rowSpan === 2
      ? 600
      : baseChars -
        imageCharsEquivalent -
        titleCharsEquivalent -
        authorsCharsEquivalent;

  const maxCharacters = maxCharsCalculated > 100 ? maxCharsCalculated : 100;

  return maxCharacters;
};
