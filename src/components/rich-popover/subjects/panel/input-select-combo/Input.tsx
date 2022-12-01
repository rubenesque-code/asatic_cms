import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as createSubject,
  selectTotalSubjects,
} from "^redux/state/subjects";

import InputSelectCombo_ from "^components/InputSelectCombo";
import { useComponentContext } from "../../Context";

const Input = () => {
  const { addSubjectRelations, parentEntityData } = useComponentContext();

  const { inputValue, setInputValue } = InputSelectCombo_.useContext();

  const numSubjects = useSelector(selectTotalSubjects);

  const dispatch = useDispatch();

  const handleCreateSubject = () => {
    const subjectId = generateUId();
    dispatch(
      createSubject({
        id: subjectId,
        translation: {
          languageId: parentEntityData.activeLanguageId,
          title: inputValue,
        },
      })
    );
    addSubjectRelations(subjectId);
    setInputValue("");
  };

  return (
    <InputSelectCombo_.Input
      placeholder={
        numSubjects
          ? "Search for a subject or enter a new one"
          : "Create first subject"
      }
      onSubmit={() => {
        const inputValueIsValid = inputValue.length > 1;
        if (!inputValueIsValid) {
          return;
        }
        handleCreateSubject();
      }}
      languageId={parentEntityData.activeLanguageId}
    />
  );
};

export default Input;
