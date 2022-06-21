import { Plus } from "phosphor-react";
import { FormEvent, useState } from "react";
import tw from "twin.macro";
import { v4 as generateUId } from "uuid";

import { ImageKeyword } from "^types/image";

const KeywordsInput = ({
  inputId,
  onSubmit,
}: {
  inputId: string;
  onSubmit: (keyword: ImageKeyword) => void;
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const valueIsValid = value.length > 2;

    if (!valueIsValid) {
      return;
    }

    onSubmit({ id: generateUId(), text: value });
    setValue("");
  };

  return (
    <KeywordsInputUI
      inputId={inputId}
      onSubmit={handleSubmit}
      setValue={setValue}
      value={value}
    />
  );
};

export default KeywordsInput;

const KeywordsInputUI = ({
  inputId,
  onSubmit,
  setValue,
  value,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputId: string;
  value: string;
  setValue: (text: string) => void;
}) => {
  return (
    <form css={[tw`relative`]} onSubmit={onSubmit}>
      <label
        css={[tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`]}
        htmlFor={inputId}
      >
        <Plus />
      </label>
      <input
        css={[
          tw`text-gray-600 focus:text-gray-800 text-sm px-lg py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={inputId}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          const valueFormatted = value.toLowerCase();
          setValue(valueFormatted);
        }}
        placeholder="Add a new keyword..."
        autoComplete="off"
        type="text"
      />
    </form>
  );
};
