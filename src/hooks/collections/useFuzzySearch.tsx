import { useSelector } from "^redux/hooks";
import { selectCollections } from "^redux/state/collections";
import { fuzzySearchCollections } from "^helpers/collection";

const useCollectionsFuzzySearch = ({
  query,
  unwantedIds = [],
}: {
  query: string;
  unwantedIds?: string[];
}) => {
  const collections = useSelector(selectCollections);
  const filteredForExcluded = collections.filter(
    (c) => !unwantedIds.includes(c.id)
  );

  if (!query.length) {
    return filteredForExcluded;
  }

  const queryMatches = fuzzySearchCollections(query, filteredForExcluded);

  return queryMatches;
};

export default useCollectionsFuzzySearch;
