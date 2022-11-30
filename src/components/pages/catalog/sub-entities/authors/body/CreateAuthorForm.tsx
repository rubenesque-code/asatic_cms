import { useState } from "react";
import tw from "twin.macro";

import { addOne as addAuthor } from "^redux/state/authors";

import {
  LanguageSelect,
  LanguageSelectProvider,
  useLanguageSelectContext,
} from "^catalog-pages/_containers";
import { AuthorIcon } from "^components/Icons";
import {
  $FormContainer_,
  $NameInput_,
} from "^catalog-pages/_presentation/$CreateEntityForm_";
import { useDispatch } from "^redux/hooks";

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

  const { selectedLanguage } = useLanguageSelectContext();

  const isNoSelectedLanguage =
    selectedLanguage === "uninitialised" || selectedLanguage === null;

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const isValid = nameInputValue.length;

    if (!isValid || isNoSelectedLanguage) {
      return;
    }

    dispatch(
      addAuthor({
        translation: { languageId: selectedLanguage.id, name: nameInputValue },
      })
    );

    setNameInputValue("");
  };

  return (
    <$FormContainer_ icon={<AuthorIcon />}>
      <div css={[tw`mt-sm`]}>
        <LanguageSelect />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <$NameInput_ setValue={setNameInputValue} value={nameInputValue} />
      </form>
    </$FormContainer_>
  );
};
