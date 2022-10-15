import { useSelector } from "^redux/hooks";
import { selectCollections } from "^redux/state/collections";
import { fuzzySearchCollections } from "^helpers/collections";

const useCollectionsFuzzySearch = ({
  query,
  unwantedIds = [],
}: {
  query: string;
  unwantedIds?: string[];
}) => {
  const collections = useSelector(selectCollections);
  const processed = collections.filter((a) => !unwantedIds.includes(a.id));

  const queryMatches = fuzzySearchCollections(query, processed);

  return query.length ? queryMatches : processed;
};

export default useCollectionsFuzzySearch;
