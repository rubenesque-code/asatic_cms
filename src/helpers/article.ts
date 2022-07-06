import { JSONContent } from "@tiptap/react";
import { Article } from "^types/article";
import { fuzzySearch } from "./general";

const getTextFromJSONContent = (content: JSONContent[]) => {
  const textArr = content
    .flatMap((node) => node?.content)
    .filter((node) => node?.type === "text")
    .map((node) => node?.text);

  return textArr;
};

// todo: weightings
// todo: turn into hook - need atuhors and languages
export const fuzzySearchArticles = (query: string, articles: Article[]) => {
  const articlesProcessed = articles.map((article) => {
    const { translations, id } = article;

    const translationsProcessed = translations.map((translation) => {
      const { body, summary, title } = translation;
      const bodyText = body?.content
        ? getTextFromJSONContent(body.content)
        : null;
      const summaryText = summary?.content
        ? getTextFromJSONContent(summary.content)
        : null;

      const translationProcessed = {
        title,
        bodyText,
        summaryText,
      };

      return translationProcessed;
    });

    const articleProcessed = {
      id,
      translations: translationsProcessed,
    };

    return articleProcessed;
  });
  console.log("articlesProcessed:", articlesProcessed);

  const result = fuzzySearch(
    ["translations.title", "translations.bodyText", "translations.summaryText"],
    articlesProcessed,
    query
  ).map((f) => f.item);

  console.log("result:", result);

  return result;
};
