import { useSelector } from "^redux/hooks";
import { selectSubjects } from "^redux/state/subjects";
import { fuzzySearchSubjects } from "^helpers/subjects";

const useSubjectsFuzzySearch = ({
  query,
  unwantedIds = [],
}: {
  query: string;
  unwantedIds?: string[];
}) => {
  const subjects = useSelector(selectSubjects);
  const processed = subjects.filter((a) => !unwantedIds.includes(a.id));

  const queryMatches = fuzzySearchSubjects(query, processed);

  return query.length ? queryMatches : processed;
};

export default useSubjectsFuzzySearch;
