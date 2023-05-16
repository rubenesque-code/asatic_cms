import { useSelector } from "^redux/hooks";
import { selectSubjectsByIds } from "^redux/state/subjects";

const useCreateSubjectsDisplayString = ({
  subjectsIds,
}: {
  subjectsIds: string[];
}) => {
  const subjects = useSelector((state) =>
    selectSubjectsByIds(state, subjectsIds)
  );
  const subjectsStr = subjects
    .map((subject) => {
      if (!subject) {
        return "[not found]";
      }
      return subject.title;
    })
    .join(", ");

  return subjectsStr;
};

export default useCreateSubjectsDisplayString;
