import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";

import { useComponentContext } from "../../../Context";

import {
  $MissingEntity,
  $Entity,
} from "^components/rich-popover/_presentation/RelatedEntities";
import Found from "./Found";
import SubjectSlice from "^context/subjects/SubjectContext";

const Subject = ({ id: subjectId }: { id: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  const { parentEntityData, removeSubjectRelations } = useComponentContext();

  return (
    <$Entity
      entity={{
        element: subject ? (
          <SubjectSlice.Provider subject={subject}>
            <Found />
          </SubjectSlice.Provider>
        ) : (
          <$MissingEntity entityType="subject" />
        ),
        name: "subject",
      }}
      parentEntity={{
        name: parentEntityData.name,
        removeFrom: () => removeSubjectRelations(subjectId),
      }}
    />
  );
};

export default Subject;
