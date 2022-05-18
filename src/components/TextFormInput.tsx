import { FormEvent, useState } from "react";
import tw from "twin.macro";

import s_input from "^styles/input";

const TextFormInput = ({
  initialValue = "",
  onSubmit,
  placeholder,
}: {
  initialValue?: string;
  onSubmit: (text: string) => void;
  placeholder: string;
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <form css={[tw``]} onSubmit={handleSubmit}>
      <input
        css={[
          s_input.input,
          s_input.focused,
          s_input.unFocused,
          s_input.transition,
        ]}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        type="text"
      />
    </form>
  );
};

export default TextFormInput;
