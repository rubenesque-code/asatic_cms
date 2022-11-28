import { useState } from "react";
import tw from "twin.macro";

import {
  LanguageSelect,
  LanguageSelectProvider,
  useLanguageSelectContext,
} from "^catalog-pages/_containers";
import { AuthorIcon } from "^components/Icons";
import { useWriteMutationContext } from "../WriteMutationContext";

const CreateAuthorForm = () => {
  return (
    <LanguageSelectProvider>
      <Form />
    </LanguageSelectProvider>
  );
};

export default CreateAuthorForm;

const Form = () => {
  const [nameInputValue, setNameInputValue] = useState("");

  const [createAuthor, { isLoading: isLoadingCreateAuthor }] =
    useWriteMutationContext();
  const { selectedLanguage } = useLanguageSelectContext();

  const handleSubmit = async () => {
    const isValid = nameInputValue.length;

    if (!isValid) {
      return;
    }

    await createAuthor({
      translation: { languageId: selectedLanguage.id, name: nameInputValue },
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
      <fieldset disabled={isLoadingCreateAuthor}>
        <h2 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
          <AuthorIcon />
          <span>Create new</span>
        </h2>
        <div css={[tw`mt-sm`]}>
          <LanguageSelect />
        </div>
        <NameInput setValue={setNameInputValue} value={nameInputValue} />
      </fieldset>
    </form>
  );
};

const nameInputId = "name-input-id";

const NameInput = ({
  setValue,
  value,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm mt-xxs`]}>
      <label css={[tw`text-gray-600`]} htmlFor={nameInputId}>
        Name:
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={nameInputId}
        placeholder="name..."
        css={[tw`py-0.5 w-full rounded-md outline-none focus:outline-none`]}
        type="text"
      />
    </div>
  );
};
