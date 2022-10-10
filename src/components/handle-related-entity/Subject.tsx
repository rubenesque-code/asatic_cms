import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";
import { Subject } from "^types/subject";

/* const HandleDocSubjects = ({
  subjectsIds,
  docActiveLanguageId,
}: {
  subjectsIds: string[];
  docActiveLanguageId: string;
}) => {
  return (
    <>
      {subjectsIds.map((id) => (
        <HandleIsSubject
          subjectId={id}
          docActiveLanguageId={docActiveLanguageId}
          key={id}
        />
      ))}
    </>
  );
};

export default HandleDocSubjects; */

const HandleDocSubject = ({
  subjectId,
  docActiveLanguageId,
}: {
  subjectId: string;
  docActiveLanguageId: string;
}) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return subject ? (
    <HandleTranslation
      docActiveLanguageId={docActiveLanguageId}
      subject={subject}
    />
  ) : (
    <SubContentMissingFromStore subContentType="subject" />
  );
};

export default HandleDocSubject;

const HandleTranslation = ({
  subject: { translations },
  docActiveLanguageId,
}: {
  subject: Subject;
  docActiveLanguageId: string;
}) => {
  const translation = translations.find(
    (t) => t.languageId === docActiveLanguageId
  );

  return (
    <>
      {translation ? (
        translation.text
      ) : (
        <MissingText tooltipText="missing translation for subject" />
      )}
    </>
  );
};
