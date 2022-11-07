import { Article } from "^types/article";
import { ArticleLikeTranslation } from "^types/article-like-entity";
import { Blog } from "^types/blog";

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

export const getImageFromArticleBody = (
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

  const isSectionWithText = textSections.find((s) => s.text?.length);

  return Boolean(isSectionWithText);
};

/* export function checkEntityHasFields<TEntity extends Article | Blog>(entity: TEntity, fields: ('title' | '')){
  
} */
export const checkTranslationHasSummaryText = (
  translation: ArticleLikeTranslation
) => {
  const { collection, general, landingCustomSection } = translation.summary;

  if (collection?.length || general?.length || landingCustomSection?.length) {
    return true;
  }

  if (checkBodyHasText(translation.body)) {
    return true;
  }

  return false;
};

export const checkIsTranslationWithFields = (
  translations: ArticleLikeTranslation[],
  fields: ("title" | "summary")[]
) => {
  const translationWithFields = translations.find((translation) => {
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];

      if (field === "title") {
        if (!translation.title?.length) {
          return false;
        }
      }
      if (field === "summary") {
        if (!checkTranslationHasSummaryText(translation)) {
          return false;
        }
      }
    }
  });

  return Boolean(translationWithFields);
};
