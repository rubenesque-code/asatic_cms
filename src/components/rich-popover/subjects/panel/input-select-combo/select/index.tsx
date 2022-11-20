import { useSelector } from "^redux/hooks";
import { selectSubjects } from "^redux/state/subjects";

import SubjectSlice from "^context/subjects/SubjectContext";
import { useComponentContext } from "../../../Context";

import useSubjectsFuzzySearch from "^hooks/subjects/useFuzzySearch";

import { arrayDivergence, mapIds } from "^helpers/general";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./Item";
import { $Container } from "^components/rich-popover/_styles/selectEntities";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const { parentEntityData } = useComponentContext();

  const excludedSubjectsIds = parentEntityData.subjectIds;

  const queryItems = useSubjectsFuzzySearch({
    query,
    unwantedIds: parentEntityData.subjectIds,
  });

  const allSubjects = useSelector(selectSubjects);
  const isUnusedSubject = Boolean(
    arrayDivergence(mapIds(allSubjects), excludedSubjectsIds).length
  );

  return (
    <InputSelectCombo.Select
      isItem={isUnusedSubject}
      isMatch={Boolean(queryItems.length)}
      entityName="subject"
    >
      <$Container>
        {queryItems.map((subject) => (
          <SubjectSlice.Provider subject={subject} key={subject.id}>
            <Item />
          </SubjectSlice.Provider>
        ))}
      </$Container>
    </InputSelectCombo.Select>
  );
};

export default Select;
