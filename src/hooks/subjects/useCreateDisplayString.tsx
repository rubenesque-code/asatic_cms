import { useSelector } from "^redux/hooks";
import { selectSubjectsByIds } from "^redux/state/subjects";

const useCreateSubjectsDisplayString = ({
  activeLanguageId,
  subjectsIds: subjectsIds,
}: {
  subjectsIds: string[];
  activeLanguageId: string;
}) => {
  const subjects = useSelector((state) =>
    selectSubjectsByIds(state, subjectsIds)
  );
  const subjectsStr = subjects
    .map((author) => {
      if (!author) {
        return "[not found]";
      }
      const translation = author.translations.find(
        (t) => t.languageId === activeLanguageId
      );
      if (!translation || !translation.text.length) {
        return "[translation missing]";
      }
      return translation.text;
    })
    .join(", ");

  return subjectsStr;
};

export default useCreateSubjectsDisplayString;
