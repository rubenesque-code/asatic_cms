import { useState } from "react";
import tw from "twin.macro";

import { useDispatch } from "^redux/hooks";
import { addOne as addRecordedEventType } from "^redux/state/recordedEventsTypes";

import {
  LanguageSelect,
  LanguageSelectProvider,
  useLanguageSelectContext,
} from "^catalog-pages/_containers";
import { RecordedEventTypeIcon } from "^components/Icons";
import {
  $FormContainer_,
  $NameInput_,
} from "^catalog-pages/_presentation/$CreateEntityForm_";

const CreateRecordedEventTypeForm = () => {
  return (
    <LanguageSelectProvider>
      <Form />
    </LanguageSelectProvider>
  );
};

export default CreateRecordedEventTypeForm;

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
      addRecordedEventType({
        translation: { languageId: selectedLanguage.id, name: nameInputValue },
      })
    );

    setNameInputValue("");
  };

  return (
    <$FormContainer_ icon={<RecordedEventTypeIcon />}>
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
