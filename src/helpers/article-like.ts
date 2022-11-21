import { Article } from "^types/article";
import { ArticleLikeTranslation } from "^types/article-like-entity";
import { Blog } from "^types/blog";

export const getArticleSummaryFromTranslation = (
  translation: ArticleLikeTranslation,
  summaryType: "default" | "collection" | "landing-user-section"
) => {
  const { body, summary } = translation;

  if (summaryType === "default") {
    if (summary.general?.length) {
      return summary.general;
    }
    if (summary.collection?.length) {
      return summary.collection;
    }
    if (summary.landingCustomSection?.length) {
      return summary.landingCustomSection;
    }
  }

  if (summaryType === "collection") {
    if (summary.collection?.length) {
      return summary.collection;
    }
    if (summary.landingCustomSection?.length) {
      return summary.landingCustomSection;
    }
    if (summary.general?.length) {
      return summary.general;
    }
  }

  if (summaryType === "landing-user-section") {
    if (summary.landingCustomSection?.length) {
      return summary.landingCustomSection;
    }
    if (summary.collection?.length) {
      return summary.collection;
    }
    if (summary.general?.length) {
      return summary.general;
    }
  }

  const textSections = body.flatMap((s) => (s.type === "text" ? [s] : []));
  const firstTextSectionWithText = textSections.find(
    (textSection) => textSection.text?.length
  );

  if (!firstTextSectionWithText) {
    return null;
  }

  return firstTextSectionWithText.text;
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

export function checkIsTranslationWithFields({
  fields,
  languagesIds,
  translations,
}: {
  translations: ArticleLikeTranslation[];
  fields: ("language" | "title" | "summaryText")[];
  languagesIds: string[];
}) {
  const translationWithFields = translations.find((translation) => {
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      if (field === "language") {
        if (!languagesIds.includes(translation.languageId)) {
          return false;
        }
      }

      if (field === "title") {
        if (!translation.title?.length) {
          return false;
        }
      }
      if (field === "summaryText") {
        if (!checkTranslationHasSummaryText(translation)) {
          return false;
        }
      }
    }
    return true;
  });

  return Boolean(translationWithFields);
}

export function checkEntityIsValidAsSummary(
  entity: Article | Blog,
  allLanguagesIds: string[]
) {
  if (entity.publishStatus !== "published") {
    return false;
  }

  const isValidTranslation = checkIsTranslationWithFields({
    translations: entity.translations,
    fields: ["language", "summaryText", "title"],
    languagesIds: allLanguagesIds,
  });

  if (!isValidTranslation) {
    return false;
  }

  return true;
}

export const checkIsValidTranslation = (
  translation: ArticleLikeTranslation,
  validLanguageIds: string[]
) => {
  const languageIsValid = validLanguageIds.includes(translation.languageId);
  const isTitle = translation.title?.length;
  const isText = checkBodyHasText(translation.body);

  return Boolean(languageIsValid && isTitle && isText);
};

export const checkHasValidTranslation = (
  translations: ArticleLikeTranslation[],
  validLanguageIds: string[]
) => {
  const validTranslation = translations.find((translation) => {
    checkIsValidTranslation(translation, validLanguageIds);
  });

  return Boolean(validTranslation);
};
