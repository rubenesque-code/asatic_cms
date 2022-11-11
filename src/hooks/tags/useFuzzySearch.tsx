import { useSelector } from "^redux/hooks";
import { selectTags } from "^redux/state/tags";
import { fuzzySearchTags } from "^helpers/tag";

const useTagsFuzzySearch = ({
  query,
  unwantedIds = [],
}: {
  query: string;
  unwantedIds?: string[];
}) => {
  const tags = useSelector(selectTags);
  const processed = tags.filter((a) => !unwantedIds.includes(a.id));

  const queryMatches = fuzzySearchTags(query, processed);

  return query.length ? queryMatches : processed;
};

export default useTagsFuzzySearch;
