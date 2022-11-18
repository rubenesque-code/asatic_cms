import { useSelector } from "^redux/hooks";
import { selectSubjectsByIds } from "^redux/state/subjects";

const useCreateSubjectsDisplayString = ({
  activeLanguageId,
  subjectsIds,
}: {
  subjectsIds: string[];
  activeLanguageId: string;
}) => {
  const subjects = useSelector((state) =>
    selectSubjectsByIds(state, subjectsIds)
  );
  const subjectsStr = subjects
    .map((subject) => {
      if (!subject) {
        return "[not found]";
      }
      const translation = subject.translations.find(
        (t) => t.languageId === activeLanguageId
      );
      if (!translation || !translation.name?.length) {
        return "[translation missing]";
      }
      return translation.name;
    })
    .join(", ");

  return subjectsStr;
};

export default useCreateSubjectsDisplayString;
