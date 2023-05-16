import { useSelector } from "^redux/hooks";
import { selectLanguages } from "^redux/state/languages";

import { fuzzySearchLanguages } from "^helpers/languages";

const useLanguagesFuzzySearch = ({
  query,
  excludedIds = [],
}: {
  query: string;
  excludedIds?: string[];
}) => {
  const languages = useSelector(selectLanguages);
  const filteredForExcluded = languages.filter(
    (a) => !excludedIds.includes(a.id)
  );

  if (!query.length) {
    return filteredForExcluded;
  }

  const queryMatches = fuzzySearchLanguages(query, filteredForExcluded);

  return queryMatches;
};

export default useLanguagesFuzzySearch;
