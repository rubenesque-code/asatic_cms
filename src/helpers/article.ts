import { Article } from "^types/article";

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
