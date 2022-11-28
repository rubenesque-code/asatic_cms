import { PlusCircle } from "phosphor-react";
import { useState } from "react";
import tw from "twin.macro";
import { TranslateIcon } from "^components/Icons";
import Popover from "^components/ProximityPopover";
import WithTooltip from "^components/WithTooltip";
import { useSelector } from "^redux/hooks";
import { useCreateLanguageMutation } from "^redux/services/languages";
import { selectLanguages } from "^redux/state/languages";

// todo: ids and names same for language. new language must have unique name

const AddLanguagePopover = () => {
  return (
    <Popover>
      <Popover.Button>
        <Button />
      </Popover.Button>
      <Popover.Panel>
        <Panel />
      </Popover.Panel>
    </Popover>
  );
};

export default AddLanguagePopover;

const Button = () => {
  return (
    <WithTooltip text="add new language">
      <button
        css={[
          tw`text-gray-200 hover:text-gray-600 transition-colors ease-in-out`,
        ]}
        type="button"
      >
        <PlusCircle />
      </button>
    </WithTooltip>
  );
};

const Panel = () => {
  return (
    <div css={[tw`bg-white shadow-md rounded-md p-md pr-3xl z-10`]}>
      <Form />
    </div>
  );
};

const Form = () => {
  const [nameInputValue, setNameInputValue] = useState("");

  const [createLanguage, { isLoading: isLoadingCreateLanguage }] =
    useCreateLanguageMutation();

  const allLanguages = useSelector(selectLanguages);
  const languagesNames = allLanguages.map((l) => l.name?.toLowerCase());
  const nameExists = languagesNames.includes(nameInputValue.toLowerCase());

  const handleSubmit = async () => {
    const isValid = nameInputValue.length && !nameExists;

    if (!isValid) {
      return;
    }

    await createLanguage({
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
      <fieldset disabled={isLoadingCreateLanguage}>
        <h2 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
          <span css={[tw`text-gray-400`]}>
            <TranslateIcon />
          </span>
          <span css={[tw`text-gray-800`]}>Create language</span>
        </h2>
        <NameInput setValue={setNameInputValue} value={nameInputValue} />
        {nameExists ? (
          <p css={[tw`text-red-warning mt-xxxs text-sm`]}>
            Can&apos;t add language. Name already exists.
          </p>
        ) : null}
      </fieldset>
    </form>
  );
};

const nameInputId = "language-name-input-id";

const NameInput = ({
  setValue,
  value,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm mt-md`]}>
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
