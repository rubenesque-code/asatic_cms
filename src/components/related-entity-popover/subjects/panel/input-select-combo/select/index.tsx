import { useSelector } from "^redux/hooks";
import { selectTotalSubjects } from "^redux/state/subjects";

import SubjectSlice from "^context/subjects/SubjectContext";

import useSubjectsFuzzySearch from "^hooks/subjects/useFuzzySearch";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./Item";

import { $Container } from "^components/related-entity-popover/_styles/selectEntities";
import { useComponentContext } from "../../../Context";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const [{ parentSubjectsIds }] = useComponentContext();

  const numSubjects = useSelector(selectTotalSubjects);
  const queryItems = useSubjectsFuzzySearch({
    query,
    unwantedIds: parentSubjectsIds,
  });

  return (
    <InputSelectCombo.Select
      show={Boolean(numSubjects)}
      isMatch={Boolean(queryItems.length)}
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
