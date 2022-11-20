import { useSelector } from "^redux/hooks";
import { selectTags } from "^redux/state/tags";
import { fuzzySearchTags } from "^helpers/tag";

const useTagsFuzzySearch = ({
  query,
  excludedIds = [],
}: {
  query: string;
  excludedIds?: string[];
}) => {
  const tags = useSelector(selectTags);
  const filteredForExcluded = tags.filter((a) => !excludedIds.includes(a.id));

  if (!query.length) {
    return filteredForExcluded;
  }

  const queryMatches = fuzzySearchTags(query, filteredForExcluded);

  return queryMatches;
};

export default useTagsFuzzySearch;
