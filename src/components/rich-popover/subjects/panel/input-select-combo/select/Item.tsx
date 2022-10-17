import SubjectSlice from "^context/subjects/SubjectContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/rich-popover/_presentation/SelectEntities";
import { Translation_ } from "^components/rich-popover/_containers/SelectEntity";

const Item = () => {
  const [{ parentType }, { addSubjectToParent }] = useComponentContext();
  const [{ id: subjectId, translations }] = SubjectSlice.useContext();

  const processed = translations.filter((t) => t.text.length);

  return (
    <$SelectEntity_
      addEntityToParent={() => addSubjectToParent(subjectId)}
      entityType="subject"
      parentType={parentType}
    >
      {processed.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          text={translation.text}
          key={translation.id}
        />
      ))}
    </$SelectEntity_>
  );
};

export default Item;
