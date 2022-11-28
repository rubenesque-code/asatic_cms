import AuthorSlice from "^context/authors/AuthorContext";

import Popover from "^components/ProximityPopover";
import { PlusCircle } from "phosphor-react";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";
import {
  LanguageSelect,
  LanguageSelectProvider,
  useLanguageSelectContext,
} from "^components/pages/catalog/_containers";
import { useState } from "react";

const AddOne = () => {
  return (
    <Popover>
      <Popover.Panel>
        <Panel />
      </Popover.Panel>
      <Popover.Button>
        <Button />
      </Popover.Button>
    </Popover>
  );
};

export default AddOne;

const Panel = () => {
  return (
    <LanguageSelectProvider>
      <PanelContent />
    </LanguageSelectProvider>
  );
};

const PanelContent = () => {
  return (
    <div css={[tw`bg-white shadow-md rounded-md p-md pr-3xl`]}>
      <h3 css={[tw`font-medium text-xl`]}>Add translation</h3>
      <Form />
    </div>
  );
};

const Form = () => {
  const [nameInputValue, setNameInputValue] = useState("");

  const { selectedLanguage } = useLanguageSelectContext();
  const [, { addTranslation }] = AuthorSlice.useContext();

  const handleSubmit = () => {
    const isValid = nameInputValue.length;

    if (!isValid) {
      return;
    }

    addTranslation({
      languageId: selectedLanguage.id,
      name: nameInputValue,
    });

    setNameInputValue("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div css={[tw`mt-sm`]}>
        <LanguageSelect />
      </div>
      <NameInput setValue={setNameInputValue} value={nameInputValue} />
    </form>
  );
};

const nameInputId = "translation-name-input-id";

const NameInput = ({
  setValue,
  value,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm mt-xs`]}>
      <label css={[tw`text-gray-600`]} htmlFor={nameInputId}>
        Name:
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={nameInputId}
        placeholder="name..."
        css={[
          tw`py-0.5 w-full rounded-md outline-none focus:outline-none min-w-[200px]`,
        ]}
        type="text"
      />
    </div>
  );
};

const Button = () => {
  return (
    <WithTooltip text="add new translation">
      <button
        css={[
          tw`text-gray-200 group-hover:text-gray-400 hover:text-gray-600 transition-colors ease-in-out`,
        ]}
        type="button"
      >
        <PlusCircle />
      </button>
    </WithTooltip>
  );
};
