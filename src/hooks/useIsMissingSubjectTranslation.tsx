import { useSelector } from "^redux/hooks";
import { selectEntitiesByIds as selectSubjectsByIds } from "^redux/state/subjects";

const useIsMissingSubjectTranslation = ({
  languagesById,
  subjectsById,
}: {
  languagesById: string[];
  subjectsById: string[];
}) => {
  const subjects = useSelector((state) =>
    selectSubjectsByIds(state, subjectsById)
  );
  const validSubjects = subjects.flatMap((s) => (s ? [s] : []));
  let isMissingTranslation = false;

  for (let i = 0; i < languagesById.length; i++) {
    const languageId = languagesById[i];

    for (let j = 0; j < validSubjects.length; j++) {
      const { translations } = validSubjects[j];
      const subjectLanguagesById = translations.map((t) => t.languageId);

      if (!subjectLanguagesById.includes(languageId)) {
        isMissingTranslation = true;
      }
    }
  }

  return isMissingTranslation;
};

export default useIsMissingSubjectTranslation;
