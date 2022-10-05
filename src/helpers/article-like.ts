import { ArticleLikeTranslation } from "^types/article-like-content";

import { checkDocHasTextContent, TipTapTextDoc } from "./tiptap";

export const getArticleSummaryFromTranslation = (
  translation: ArticleLikeTranslation,
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
