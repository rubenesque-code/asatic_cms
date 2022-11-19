import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as createCollection,
  selectTotalCollections,
} from "^redux/state/collections";

import InputSelectCombo_ from "^components/InputSelectCombo";
import { useComponentContext } from "../../Context";

const Input = () => {
  const { addCollectionRelations, parentEntityData } = useComponentContext();

  const { inputValue, setInputValue } = InputSelectCombo_.useContext();

  const numCollections = useSelector(selectTotalCollections);

  const dispatch = useDispatch();

  const handleCreateCollection = () => {
    const collectionId = generateUId();
    dispatch(
      createCollection({
        id: collectionId,
        translation: {
          title: inputValue,
          languageId: parentEntityData.activeLanguageId,
        },
      })
    );
    addCollectionRelations(collectionId);
    setInputValue("");
  };

  return (
    <InputSelectCombo_.Input
      placeholder={
        numCollections
          ? "Search for an collection or enter a new one"
          : "Create first collection"
      }
      onSubmit={() => {
        const inputValueIsValid = inputValue.length > 1;
        if (!inputValueIsValid) {
          return;
        }
        handleCreateCollection();
      }}
      languageId={parentEntityData.activeLanguageId}
    />
  );
};

export default Input;
