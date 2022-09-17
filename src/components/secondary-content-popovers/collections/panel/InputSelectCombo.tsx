import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import { addOne as addSubject, selectSubjects } from "^redux/state/subjects";

import { fuzzySearchSubjects } from "^helpers/subjects";

import { Subject } from "^types/subject";

import InputSelectCombo from "^components/InputSelectCombo";

import DocCollectionsPanel from ".";
import PanelUI from "../../PanelUI";

import SelectEntityUI from "^components/secondary-content-popovers/SelectEntityUI";

const DocSubjectsInputSelectCombo = () => {
  return (
    <PanelUI.InputSelectCombo>
      <InputSelectCombo>
        <>
          <Input />
          <Select />
        </>
      </InputSelectCombo>
    </PanelUI.InputSelectCombo>
  );
};

export default DocSubjectsInputSelectCombo;

const Input = () => {
  const { addCollectionToDoc: addSubjectToDoc, docActiveLanguageId } =
    DocCollectionsPanel.useContext();
  const { inputValue, setInputValue } = InputSelectCombo.useContext();

  const dispatch = useDispatch();

  const submitNewSubject = () => {
    const id = generateUId();
    dispatch(
      addSubject({ id, text: inputValue, languageId: docActiveLanguageId })
    );
    addSubjectToDoc(id);
    setInputValue("");
  };

  return (
    <InputSelectCombo.Input
      placeholder="Add a new subject..."
      onSubmit={() => {
        submitNewSubject();
      }}
    />
  );
};

const Select = () => {
  const allSubjects = useSelector(selectSubjects);

  const { inputValue } = InputSelectCombo.useContext();

  const subjectsMatchingQuery = fuzzySearchSubjects(inputValue, allSubjects);

  return (
    <InputSelectCombo.Select>
      {subjectsMatchingQuery.map((subject) => (
        <SelectSubject subject={subject} key={subject.id} />
      ))}
    </InputSelectCombo.Select>
  );
};

const SelectSubject = ({ subject }: { subject: Subject }) => {
  const {
    addCollectionToDoc: addSubjectToDoc,
    docCollectionsIds: docSubjectsIds,
  } = DocCollectionsPanel.useContext();

  const canAddToDoc = !docSubjectsIds.includes(subject.id);

  return (
    <SelectEntityUI
      addToDoc={() => addSubjectToDoc(subject.id)}
      canAddToDoc={canAddToDoc}
    >
      {subject.translations
        .filter((translation) => translation.text.length)
        .map((translation, i) => (
          <SelectEntityUI.Translation
            id={translation.id}
            index={i}
            text={translation.text}
            key={translation.id}
          />
        ))}
    </SelectEntityUI>
  );
};
