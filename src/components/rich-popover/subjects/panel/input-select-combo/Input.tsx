import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as addSubject,
  selectTotalSubjects,
} from "^redux/state/subjects";

import InputSelectCombo_ from "^components/InputSelectCombo";
import { useComponentContext } from "../../Context";

const Input = () => {
  const [{ activeLanguageId }, { addSubjectToParent }] = useComponentContext();

  const { inputValue, setInputValue } = InputSelectCombo_.useContext();

  const numSubjects = useSelector(selectTotalSubjects);

  const dispatch = useDispatch();

  const handleCreateSubject = () => {
    const subjectId = generateUId();
    dispatch(
      addSubject({
        id: subjectId,
        languageId: activeLanguageId,
        text: inputValue,
      })
    );
    addSubjectToParent(subjectId);
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
      languageId={activeLanguageId}
    />
  );
};

export default Input;
