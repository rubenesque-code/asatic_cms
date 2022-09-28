import { JSONContent } from "@tiptap/react";
import produce from "immer";
import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";

import { Article, ArticleTranslation } from "^types/article";
import { ArticleLikeTranslation } from "^types/article-like-content";
import { Blog } from "^types/blog";
// import { ArticleLikeContentTranslation } from "^types/article-like-primary-content";
import { checkDocHasTextContent, TipTapTextDoc } from "./tiptap";

export const getImageIdsFromBody = (body: JSONContent) => {
  const imageIds = body
    .content!.filter((node) => node.type === "image")
    .flatMap((node) => node.attrs!.id);

  return imageIds;
};

// todo: move to diff file. Is used for e.g recorded events
export function selectTranslationForActiveLanguage<
  TTranslation extends { languageId: string }
>(translations: TTranslation[], activeLanguageId: string) {
  const translationForActiveLanguage = translations.find(
    (t) => t.languageId === activeLanguageId
  );
  const translationForDefault = translations.find(
    (t) => t.languageId === default_language_Id
  );
  const translationForSecondDefault = translations.find(
    (t) => t.languageId === second_default_language_Id
  );

  const translationToUse = translationForActiveLanguage
    ? translationForActiveLanguage
    : translationForDefault
    ? translationForDefault
    : translationForSecondDefault
    ? translationForSecondDefault
    : translations[0];

  return translationToUse;
}

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

  if (!firstTextSection.text) {
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

export function orderArticles<TEntity extends Article | Blog>(
  articles: TEntity[]
) {
  return produce(articles, (draft) => {
    draft.sort((a, b) => {
      const aIsNew = !a.lastSave;
      const bIsNew = !b.lastSave;
      if (aIsNew && bIsNew) {
        return 0;
      } else if (aIsNew) {
        return -1;
      } else if (bIsNew) {
        return 1;
      }
      if (a.publishStatus === "published" && b.publishStatus === "published") {
        return 0;
      } else if (a.publishStatus === "published") {
        return -1;
      } else if (b.publishStatus === "published") {
        return 1;
      }

      return 0;
    });
  });
}
