import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import { addOne as addTag, selectTotalTags } from "^redux/state/tags";

import InputSelectCombo_ from "^components/InputSelectCombo";
import { useComponentContext } from "../../Context";

const Input = () => {
  const [, { addTagToRelatedEntity: addTagToParent }] = useComponentContext();

  const { inputValue, setInputValue } = InputSelectCombo_.useContext();

  const numTags = useSelector(selectTotalTags);

  const dispatch = useDispatch();

  const handleCreateTag = () => {
    const tagId = generateUId();
    dispatch(
      addTag({
        id: tagId,
        text: inputValue,
      })
    );
    addTagToParent(tagId);
    setInputValue("");
  };

  return (
    <InputSelectCombo_.Input
      placeholder={
        numTags ? "Search for a tag or enter a new one" : "Create first tag"
      }
      onSubmit={() => {
        const inputValueIsValid = inputValue.length > 1;
        if (!inputValueIsValid) {
          return;
        }
        handleCreateTag();
      }}
    />
  );
};

export default Input;
