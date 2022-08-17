import { ArticleLikeContentTranslation } from "^types/article-like-primary-content";

export const getSummaryFromArticleLikeContentBody = (
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
