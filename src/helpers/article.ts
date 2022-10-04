import { ArticleTranslation } from "^types/article";
import { ArticleLikeTranslation } from "^types/article-like-content";

import { checkDocHasTextContent, TipTapTextDoc } from "./tiptap";

export const getArticleSummaryFromTranslation = (
  translation: ArticleTranslation,
  summaryType: "auto" | "user" | "collection"
) => {
  const { body, collectionSummary, landingAutoSummary, landingCustomSummary } =
    translation;

  const isCollectionSummaryText =
    collectionSummary &&
    checkDocHasTextContent(collectionSummary as TipTapTextDoc);
  const isAutoSummaryText =
    landingAutoSummary &&
    checkDocHasTextContent(landingAutoSummary as TipTapTextDoc);
  const isUserSummaryText =
    landingCustomSummary &&
    checkDocHasTextContent(landingCustomSummary as TipTapTextDoc);

  if (summaryType === "auto") {
    if (isAutoSummaryText) {
      return landingAutoSummary;
    } else if (isUserSummaryText) {
      return landingCustomSummary;
    } else if (isAutoSummaryText) {
      return landingAutoSummary;
    }
  }

  if (summaryType === "collection") {
    if (isCollectionSummaryText) {
      return collectionSummary;
    } else if (isUserSummaryText) {
      return landingCustomSummary;
    } else if (isAutoSummaryText) {
      return landingAutoSummary;
    }
  }

  if (summaryType === "user") {
    if (isUserSummaryText) {
      return landingCustomSummary;
    } else if (isCollectionSummaryText) {
      return collectionSummary;
    } else if (isAutoSummaryText) {
      return landingAutoSummary;
    }
  }

  const bodyTextSections = body.flatMap((s) => (s.type === "text" ? [s] : []));
  const firstTextSection = bodyTextSections[0];

  if (!firstTextSection?.text) {
    return null;
  }

  const tipTapDoc = firstTextSection.text;

  if (!tipTapDoc.content) {
    return null;
  }

  return {
    ...tipTapDoc,
    content: [tipTapDoc.content[0]],
  };
};

export const getFirstImageFromArticleBody = (
  body: ArticleLikeTranslation["body"]
) => {
  const imageSections = body.flatMap((s) => (s.type === "image" ? [s] : []));

  if (!imageSections.length) {
    return null;
  }

  for (let i = 0; i < imageSections.length; i++) {
    const {
      image: { imageId },
    } = imageSections[i];

    if (imageId) {
      return imageId;
    }
  }

  return null;
};

export const truncateText = (tiptapDoc: TipTapTextDoc, numChar: number) => {
  const firstPara = tiptapDoc.content.find((node) => node.type === "paragraph");

  if (!firstPara) {
    return null;
  }

  const firstParaText = firstPara.content?.find(
    (node) => node.type === "text"
  )?.text;

  if (!firstParaText) {
    return null;
  }

  const firstParaTextTruncated = `${firstParaText.substring(0, numChar)}...`;

  return {
    ...tiptapDoc,
    content: [
      {
        ...firstPara,
        content: [{ type: "text", text: firstParaTextTruncated }],
      },
    ],
  };
};
