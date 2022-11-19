import { fuzzySearchAuthors } from "^helpers/author";
import { useSelector } from "^redux/hooks";
import { selectAuthors } from "^redux/state/authors";

const useAuthorsFuzzySearch = ({
  query,
  unwantedIds = [],
}: {
  query: string;
  unwantedIds?: string[];
}) => {
  const authors = useSelector(selectAuthors);
  const filteredForExcluded = authors.filter(
    (a) => !unwantedIds.includes(a.id)
  );

  if (!query.length) {
    return filteredForExcluded;
  }

  const queryMatches = fuzzySearchAuthors(query, filteredForExcluded);

  return queryMatches;
};

export default useAuthorsFuzzySearch;
