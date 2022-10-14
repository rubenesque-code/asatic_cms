import { fuzzySearchAuthors } from "^helpers/authors";
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
  const processed = authors.filter((a) => !unwantedIds.includes(a.id));

  const queryMatches = fuzzySearchAuthors(query, processed);

  return query.length ? queryMatches : processed;
};

export default useAuthorsFuzzySearch;
