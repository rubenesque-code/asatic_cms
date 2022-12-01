import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";

import { useComponentContext } from "../../../Context";

import {
  $MissingEntity,
  $RelatedEntityMenu_,
  $RelatedEntity_,
} from "^components/rich-popover/_presentation";
import Found from "./Found";
import SubjectSlice from "^context/subjects/SubjectContext";
import { ROUTES } from "^constants/routes";

const RelatedEntity = ({ id: subjectId }: { id: string }) => {
  return (
    <$RelatedEntity_
      entity={<Subject id={subjectId} />}
      menu={<Menu id={subjectId} />}
    />
  );
};

export default RelatedEntity;

const Subject = ({ id: subjectId }: { id: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return subject ? (
    <SubjectSlice.Provider subject={subject}>
      <Found />
    </SubjectSlice.Provider>
  ) : (
    <$MissingEntity entityType="subject" />
  );
};

const Menu = ({ id: subjectId }: { id: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  const { removeSubjectRelations } = useComponentContext();

  return (
    <$RelatedEntityMenu_
      relatedEntity={{
        remove: () => removeSubjectRelations(subjectId),
        href: subject ? `${ROUTES.SUBJECTS.route}/${subjectId}` : undefined,
      }}
    />
  );
};
