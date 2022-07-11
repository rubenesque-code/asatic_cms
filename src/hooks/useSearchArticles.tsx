import { fuzzySearch, getTextFromJSONContent } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectAll as selectAuthors } from "^redux/state/authors";
import { selectAll as selectLanguages } from "^redux/state/languages";
import { selectAll as selectTags } from "^redux/state/tags";
import { Article } from "^types/article";

const useSearchArticles = (query: string, articles: Article[]) => {
  const authors = useSelector(selectAuthors);
  const languages = useSelector(selectLanguages);
  const tags = useSelector(selectTags);

  const articlesQueryable = articles.map((article) => {
    const { id, authorIds, tagIds, translations } = article;

    const translationsQueryable = translations.map((translation) => {
      const {
        body,
        autoSectionSummary: summary,
        title,
        languageId,
      } = translation;

      const bodyText = body?.content
        ? getTextFromJSONContent(body.content)
        : null;

      const summaryText = summary?.content
        ? getTextFromJSONContent(summary.content)
        : null;

      const language = languages.find((language) => language.id === languageId);
      const languageText = language?.name;

      const translationQueryable = {
        title: [title],
        body: bodyText,
        summary: summaryText,
        language: languageText,
      };

      return translationQueryable;
    });

    const authorsQueryable = authorIds.map((authorId) => {
      const author = authors.find((author) => author.id === authorId);

      if (!author) {
        return null;
      }

      const translationsQueryable = author.translations.map((translation) => {
        return translation.name;
      });

      return translationsQueryable;
    });

    const tagsQueryable = tagIds.map((tagId) => {
      const tag = tags.find((tag) => tag.id === tagId);

      return tag?.text;
    });

    return {
      id,
      translations: translationsQueryable,
      authors: authorsQueryable,
      tags: tagsQueryable,
    };
  });

  const queryResult = fuzzySearch(
    [
      "translations.title",
      "translations.body",
      "translations.summary",
      "translations.language",
      "authors",
      "tags",
    ],
    articlesQueryable,
    query
  ).map((f) => f.item);

  const articlesMatchingQuery = queryResult.map((queryArticle) =>
    articles.find((article) => article.id === queryArticle.id)
  ) as Article[];

  return articlesMatchingQuery;
};

export default useSearchArticles;
