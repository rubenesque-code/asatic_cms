import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as createAuthor,
  selectTotalAuthors,
} from "^redux/state/authors";

import InputSelectCombo_ from "^components/InputSelectCombo";
import { useComponentContext } from "../../Context";

const Input = () => {
  const { addAuthorRelations, parentEntityData } = useComponentContext();

  const { inputValue, setInputValue } = InputSelectCombo_.useContext();

  const numAuthors = useSelector(selectTotalAuthors);

  const dispatch = useDispatch();

  const handleCreateAuthor = () => {
    const authorId = generateUId();
    dispatch(
      createAuthor({
        id: authorId,
        translation: {
          languageId: parentEntityData.activeLanguageId,
          name: inputValue,
        },
      })
    );
    addAuthorRelations(authorId);
    setInputValue("");
  };

  return (
    <InputSelectCombo_.Input
      placeholder={
        numAuthors
          ? "Search for an author or enter a new one"
          : "Create first author"
      }
      onSubmit={() => {
        const inputValueIsValid = inputValue.length > 1;
        if (!inputValueIsValid) {
          return;
        }
        handleCreateAuthor();
      }}
      languageId={parentEntityData.activeLanguageId}
    />
  );
};

export default Input;
