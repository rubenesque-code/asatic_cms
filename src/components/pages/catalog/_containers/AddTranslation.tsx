import { useState } from "react";
import { PlusCircle } from "phosphor-react";
import tw from "twin.macro";

import Popover from "^components/ProximityPopover";
import WithTooltip from "^components/WithTooltip";
import {
  LanguageSelect,
  LanguageSelectProvider,
  useLanguageSelectContext,
} from "^components/pages/catalog/_containers";

type Props = {
  addTranslation: ({
    languageId,
    text,
  }: {
    text: string;
    languageId: string;
  }) => void;
  translationTextKey: string;
  excludedLanguagesIds: string[];
};

const AddTranslation = ({ addTranslation, ...props }: Props) => {
  return (
    <Popover>
      <Popover.Panel>
        {({ close }) => (
          <Panel
            addTranslation={(props: Parameters<Props["addTranslation"]>[0]) => {
              addTranslation(props);
              close();
            }}
            {...props}
          />
        )}
      </Popover.Panel>
      <Popover.Button>
        <Button />
      </Popover.Button>
    </Popover>
  );
};

export { AddTranslation };

const Panel = ({ excludedLanguagesIds, ...props }: Props) => {
  return (
    <LanguageSelectProvider excludedLanguagesIds={excludedLanguagesIds}>
      <PanelContent {...props} />
    </LanguageSelectProvider>
  );
};

const PanelContent = (
  props: Pick<Props, "addTranslation" | "translationTextKey">
) => {
  return (
    <div css={[tw`bg-white shadow-md rounded-md p-md pr-3xl`]}>
      <h3 css={[tw`font-medium text-xl`]}>Add translation</h3>
      <Form {...props} />
    </div>
  );
};

const Form = ({
  addTranslation,
  translationTextKey,
}: Pick<Props, "addTranslation" | "translationTextKey">) => {
  const [nameInputValue, setNameInputValue] = useState("");

  const { selectedLanguage } = useLanguageSelectContext();

  const isNoSelectedLanguage =
    selectedLanguage === "uninitialised" || selectedLanguage === null;

  const handleSubmit = () => {
    const isValid = nameInputValue.length;

    if (!isValid || isNoSelectedLanguage) {
      return;
    }

    addTranslation({
      languageId: selectedLanguage.id,
      text: nameInputValue,
    });

    setNameInputValue("");
  };

  return (
    <div css={[tw`mt-sm`]}>
      <LanguageSelect />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NameInput
          setValue={setNameInputValue}
          value={nameInputValue}
          translationTextKey={translationTextKey}
          isDisabled={isNoSelectedLanguage}
        />
      </form>
    </div>
  );
};

const nameInputId = "translation-name-input-id";

const NameInput = ({
  setValue,
  value,
  translationTextKey,
  isDisabled,
}: {
  value: string;
  setValue: (value: string) => void;
  translationTextKey: string;
  isDisabled: boolean;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm mt-xs`]}>
      <label css={[tw`text-gray-600 capitalize`]} htmlFor={nameInputId}>
        {translationTextKey}:
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={nameInputId}
        placeholder={`${translationTextKey}...`}
        css={[
          tw`py-0.5 w-full rounded-md outline-none focus:outline-none min-w-[200px]`,
        ]}
        type="text"
        disabled={isDisabled}
        autoComplete="off"
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
