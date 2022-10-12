import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import { addOne as addAuthor, selectAuthors } from "^redux/state/authors";

import { fuzzySearchAuthors } from "^helpers/authors";

import { Author } from "^types/author";

import InputSelectCombo from "^components/InputSelectCombo";

import DocAuthorsPanel from ".";
import PanelUI from "../../PanelUI";

import SelectEntityUI from "^components/secondary-content-popovers/SelectEntityUI";

const DocAuthorsInputSelectCombo = () => {
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

export default DocAuthorsInputSelectCombo;

const Input = () => {
  const { addAuthorToDoc, activeLanguageId: docActiveLanguageId } =
    DocAuthorsPanel.useContext();
  const { inputValue, setInputValue } = InputSelectCombo.useContext();

  const dispatch = useDispatch();

  const submitNewAuthor = () => {
    const id = generateUId();
    dispatch(
      addAuthor({ id, name: inputValue, languageId: docActiveLanguageId })
    );
    addAuthorToDoc(id);
    setInputValue("");
  };

  return (
    <InputSelectCombo.Input
      placeholder="Add a new author..."
      onSubmit={() => {
        submitNewAuthor();
      }}
    />
  );
};

const Select = () => {
  const allAuthors = useSelector(selectAuthors);

  const { inputValue } = InputSelectCombo.useContext();

  const authorsMatchingQuery = fuzzySearchAuthors(inputValue, allAuthors);

  return (
    <InputSelectCombo.Select>
      {authorsMatchingQuery.map((author) => (
        <SelectAuthor author={author} key={author.id} />
      ))}
    </InputSelectCombo.Select>
  );
};

const SelectAuthor = ({ author }: { author: Author }) => {
  const { addAuthorToDoc, recordedEventTypeId: docAuthorsIds } =
    DocAuthorsPanel.useContext();

  const canAddToDoc = !docAuthorsIds.includes(author.id);

  return (
    <SelectEntityUI
      addToDoc={() => addAuthorToDoc(author.id)}
      canAddToDoc={canAddToDoc}
    >
      {author.translations
        .filter((translation) => translation.name.length)
        .map((translation, i) => (
          <SelectEntityUI.Translation
            id={translation.id}
            index={i}
            text={translation.name}
            key={translation.id}
          />
        ))}
    </SelectEntityUI>
  );
};
