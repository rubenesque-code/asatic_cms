import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";
import { Subject as SubjectType } from "^types/subject";

import { MissingEntity } from "./_presentation";

export const HandleEntitySubjects = ({
  subjectsIds,
}: {
  subjectsIds: string[];
}) => {
  if (!subjectsIds.length) {
    return null;
  }

  return (
    <div css={[tw`flex gap-xs flex-wrap line-height[1em]`]}>
      {subjectsIds.map((id, i) => (
        <div css={[tw`flex`]} key={id}>
          <HandleEntitySubject
            subjectId={id}
            useComma={subjectsIds.length > 1 && i < subjectsIds.length - 1}
          />
        </div>
      ))}
    </div>
  );
};

export const HandleEntitySubject = ({
  subjectId,
  useComma = false,
}: {
  subjectId: string;
  useComma?: boolean;
}) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return subject ? (
    <Subject subject={subject} useComma={useComma} />
  ) : (
    <MissingEntity subContentType="subject" />
  );
};

const Subject = ({
  subject,
  useComma,
}: {
  subject: SubjectType;
  useComma: boolean;
}) => {
  return (
    <span>
      {subject.title}
      {useComma ? "," : null}
    </span>
  );
};
