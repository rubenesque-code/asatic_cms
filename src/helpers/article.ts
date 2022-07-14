import { JSONContent } from "@tiptap/react";
import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";

import { Article, ArticleTranslation } from "^types/article";

export const computeErrors = (article: Article) => {
  const isDraft = article.publishInfo.status === "draft";

  if (isDraft) {
    return null;
  }

  const isTranslationWithRequiredFields = article.translations.find((t) => {
    const hasTitle = t.title;
    const hasTextSectionWithContent = t.sections?.find(
      (s) => s.type === "text" && s.htmlString?.length
    );

    return hasTitle && hasTextSectionWithContent;
  });

  if (isTranslationWithRequiredFields) {
    return null;
  }

  const errorsArr: string[] = [];

  if (!isTranslationWithRequiredFields) {
    errorsArr.push("no translation with both title and text");
  }

  return errorsArr;
};

export const getArticleSummaryFromBody = (body: JSONContent) => {
  const firstParaNode = body.content?.find((n) => n.type === "paragraph");

  const contentUnstyled = firstParaNode?.content?.map(({ text, type }) => ({
    text,
    type,
  }));

  const firstParaNodeProcessed = {
    ...firstParaNode,
    content: contentUnstyled,
  };

  const newContent = {
    type: "doc",
    content: [firstParaNodeProcessed],
  } as JSONContent;

  return firstParaNode ? newContent : undefined;
};

export const getImageIdsFromBody = (body: JSONContent) => {
  const imageIds = body
    .content!.filter((node) => node.type === "image")
    .flatMap((node) => node.attrs!.id);

  return imageIds;
};

export const computeTranslationForActiveLanguage = (
  translations: Article["translations"],
  activeLanguageId: string
) => {
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
};

export const getArticleSummaryFromTranslation = ({
  summaryType,
  translation,
}: {
  translation: ArticleTranslation;
  summaryType: "auto" | "user";
}) => {
  const { body, landingPage } = translation;

  const autoSummary = landingPage?.autoSummary;
  const userSummary = landingPage?.userSummary;

  if (summaryType === "auto") {
    if (autoSummary) {
      return autoSummary;
    } else if (userSummary) {
      return userSummary;
    }
  }

  if (summaryType === "user") {
    if (userSummary) {
      return userSummary;
    } else if (autoSummary) {
      return autoSummary;
    }
  }

  const summaryFromBody = getArticleSummaryFromBody(body);
  if (summaryFromBody) {
    return summaryFromBody;
  } else {
    return null;
  }
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
