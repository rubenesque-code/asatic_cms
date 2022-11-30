import { useState } from "react";

import { addOne as addTag } from "^redux/state/tags";

import { TagIcon } from "^components/Icons";
import {
  $FormContainer_,
  $NameInput_,
} from "^catalog-pages/_presentation/$CreateEntityForm_";

const CreateTagForm = () => {
  const [nameInputValue, setNameInputValue] = useState("");

  const handleSubmit = async () => {
    const isValid = nameInputValue.length;

    if (!isValid) {
      return;
    }

    addTag({
      text: nameInputValue,
    });

    setNameInputValue("");
  };

  return (
    <$FormContainer_ icon={<TagIcon />}>
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

export default CreateTagForm;
