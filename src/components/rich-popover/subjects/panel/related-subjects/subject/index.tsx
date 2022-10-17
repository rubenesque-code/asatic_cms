import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";

import SubjectSlice from "^context/subjects/SubjectContext";

import { $MissingEntity } from "^components/rich-popover/_presentation/RelatedEntities";
import Found from "./Found";

const Subject = ({ id }: { id: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, id));

  return subject ? (
    <SubjectSlice.Provider subject={subject}>
      <Found />
    </SubjectSlice.Provider>
  ) : (
    <$MissingEntity entityType="subject" />
  );
};

export default Subject;
