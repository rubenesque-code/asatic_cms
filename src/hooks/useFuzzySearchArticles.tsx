import { fuzzySearch } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectAll as selectAuthors } from "^redux/state/authors";
import { selectAll as selectSubjects } from "^redux/state/subjects";
import { selectAll as selectTags } from "^redux/state/tags";
import { Article } from "^types/article";

// todo: weightings
// todo: get text from body

const useFuzzySearchArticles = (articles: Article[], query: string) => {
  const allAuthors = useSelector(selectAuthors);
  const allSubjects = useSelector(selectSubjects);
  const allTags = useSelector(selectTags);

  if (query.length < 1) {
    return articles;
  }

  // create searchable articles
  const queryableArticles = articles.map(
    ({ id, authorIds, subjectIds, tagIds, translations }) => {
      const authors = authorIds
        .map((id) => allAuthors.find((a) => a.id === id))
        .flatMap((a) => (a ? [a] : []))
        .flatMap((a) => a.translations)
        .flatMap((t) => t.name);

      const subjects = subjectIds
        .map((id) => allSubjects.find((a) => a.id === id))
        .flatMap((a) => (a ? [a] : []))
        .flatMap((a) => a.translations)
        .flatMap((t) => t.text);

      const tags = tagIds
        .map((id) => allTags.find((t) => t.id === id))
        .flatMap((a) => (a ? [a] : []))
        .flatMap((t) => t.text);

      const titles = translations.map((t) => t.title);

      return {
        id,
        authors,
        subjects,
        tags,
        titles,
      };
    }
  );

  const articlesMatchingQueryById = fuzzySearch(
    ["titles", "authors", "subjects", "tags"],
    queryableArticles,
    query
  ).map((r) => r.item.id);

  const articlesMatchingQuery = articlesMatchingQueryById.map(
    (id) => articles.find((a) => a.id === id)!
  );

  return articlesMatchingQuery;
};

export default useFuzzySearchArticles;
