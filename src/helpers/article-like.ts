import { ArticleLikeTranslation } from "^types/article-like-entity";

import { checDocHasTextContent } from "./tiptap";

export const getArticleSummaryFromTranslation = (
  translation: ArticleLikeTranslation,
  summaryType: "auto" | "user" | "collection"
) => {
  const { body, collectionSummary, landingAutoSummary, landingCustomSummary } =
    translation;

  const isCollectionSummaryText =
    collectionSummary && checDocHasTextContent(collectionSummary);
  const isAutoSummaryText =
    landingAutoSummary && checDocHasTextContent(landingAutoSummary);
  const isUserSummaryText =
    landingCustomSummary && checDocHasTextContent(landingCustomSummary);

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

export const checkBodyHasText = (body: ArticleLikeTranslation["body"]) => {
  const textSections = body.flatMap((section) =>
    section.type === "text" ? [section] : []
  );
  const firstTextSection = textSections[0];

  if (!firstTextSection?.text) {
    return false;
  }

  const hasText = checDocHasTextContent(firstTextSection.text);

  return hasText;
};
