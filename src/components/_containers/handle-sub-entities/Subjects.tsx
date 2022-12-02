import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";
import { Subject as SubjectType } from "^types/subject";

import { MissingTranslation, MissingEntity } from "./_presentation";

type ActiveLanguageIdProp = { activeLanguageId: string };

export const HandleEntitySubjects = ({
  subjectsIds,
  activeLanguageId,
}: {
  subjectsIds: string[];
} & ActiveLanguageIdProp) => {
  if (!subjectsIds.length) {
    return null;
  }

  return (
    <div css={[tw`flex gap-xs flex-wrap line-height[1em]`]}>
      {subjectsIds.map((id, i) => (
        <div css={[tw`flex`]} key={id}>
          <HandleEntitySubject
            subjectId={id}
            activeLanguageId={activeLanguageId}
            useComma={subjectsIds.length > 1 && i < subjectsIds.length - 1}
          />
        </div>
      ))}
    </div>
  );
};

export const HandleEntitySubject = ({
  subjectId,
  activeLanguageId,
  useComma = false,
}: { subjectId: string; useComma?: boolean } & ActiveLanguageIdProp) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return subject ? (
    <Subject
      activeLanguageId={activeLanguageId}
      subject={subject}
      useComma={useComma}
    />
  ) : (
    <MissingEntity subContentType="subject" />
  );
};

const Subject = ({
  subject: { translations },
  activeLanguageId,
  useComma,
}: { subject: SubjectType; useComma: boolean } & ActiveLanguageIdProp) => {
  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <span>
      {translation ? (
        translation.title
      ) : (
        <MissingTranslation tooltipText="missing subject title for translation" />
      )}
      {useComma ? "," : null}
    </span>
  );
};
