import { useDispatch } from "^redux/hooks";

import InputSelectCombo_ from "^components/InputSelectCombo";
import { useComponentContext } from "../../Context";
import { addOne as createLanguage } from "^redux/state/languages";

const Input = () => {
  const { parentEntity } = useComponentContext();

  const { inputValue, setInputValue } = InputSelectCombo_.useContext();

  const dispatch = useDispatch();

  const handleCreateTranslation = () => {
    dispatch(
      createLanguage({
        name: inputValue,
      })
    );
    parentEntity.addTranslation(inputValue);
    setInputValue("");
  };

  return (
    <InputSelectCombo_.Input
      placeholder="Create a new language or add an existing one..."
      onSubmit={() => {
        const inputValueIsValid = inputValue.length > 1;
        if (!inputValueIsValid) {
          return;
        }
        handleCreateTranslation();
      }}
    />
  );
};

export default Input;
