import { useSelector } from "^redux/hooks";
import { selectSubjects } from "^redux/state/subjects";
import { fuzzySearchSubjects } from "^helpers/subject";

const useSubjectsFuzzySearch = ({
  query,
  unwantedIds = [],
}: {
  query: string;
  unwantedIds?: string[];
}) => {
  const subjects = useSelector(selectSubjects);
  const filteredForExcluded = subjects.filter(
    (a) => !unwantedIds.includes(a.id)
  );

  if (!query.length) {
    return filteredForExcluded;
  }

  const queryMatches = fuzzySearchSubjects(query, filteredForExcluded);

  return queryMatches;
};

export default useSubjectsFuzzySearch;
