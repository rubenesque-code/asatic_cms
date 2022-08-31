import { JSONContent } from "@tiptap/react";
import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";
import { RootState } from "^redux/store";

import { Article, ArticleTranslation } from "^types/article";
import { ArticleLikeTextSection } from "^types/article-like-content";
import { ArticleLikeContentTranslation } from "^types/article-like-primary-content";
import { dicToArr } from "./general";
import {
  checkDocHasTextContent,
  getFirstParaTextFromDoc,
  TipTapTextDoc,
} from "./tiptap";

export const getArticleSummaryFromBody = (
  body: ArticleLikeContentTranslation["body"]
) => {
  const textSections = body.flatMap((s) => (s.type === "text" ? [s] : []));

  if (!textSections.length) {
    return null;
  }

  const firstTextSection = textSections[0];

  const { content } = firstTextSection;

  if (!content?.content?.length) {
    return null;
  }

  const firstPara = content.content[0];

  const firstParaContent = firstPara?.content;
  if (!firstParaContent) {
    return null;
  }

  const isText = firstParaContent[0].text?.length;

  const doc = {
    type: "doc",
    content: [firstPara],
  };

  return isText ? doc : null;
};

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

const checkJSONSummaryHasText = (node: JSONContent) => {
  const primaryNodeContent = node.content;

  if (!primaryNodeContent) {
    return false;
  }

  for (let i = 0; i < primaryNodeContent.length; i++) {
    const secondaryNode = primaryNodeContent[i] as {
      type: "paragraph";
      content?: { type: "text"; text?: string }[];
    };
    const secondaryNodeContent = secondaryNode.content;

    if (!secondaryNodeContent) {
      break;
    }

    for (let i = 0; i < secondaryNodeContent.length; i++) {
      const tertiaryNode = secondaryNodeContent[i];

      if (tertiaryNode?.text?.length) {
        return true;
      }
    }
  }

  return false;
};

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
  if (!firstTextSection || !firstTextSection.text) {
    return null;
  }
  const isText = checkDocHasTextContent(firstTextSection.text as TipTapTextDoc);

  return isText ? firstTextSection.text! : null;
};

export const getArticleSummaryImageId = (
  article: Article,
  translation: ArticleTranslation
) => {
  const summaryImgId = article.summaryImage.imageId;
  if (summaryImgId) {
    return summaryImgId;
  }

  const bodyImagesById = getImageIdsFromBody(translation.body);

  if (bodyImagesById.length) {
    return bodyImagesById[0];
  }

  return null;
};

export const getFirstImageFromArticleBody = (
  body: ArticleLikeContentTranslation["body"]
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
