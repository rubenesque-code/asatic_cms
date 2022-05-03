import { FormEvent, useState } from "react";
import tw from "twin.macro";
import useFocused from "^hooks/useFocused";

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
  const [isFocused, focusHandlers] = useFocused();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <form css={[tw``]} onSubmit={handleSubmit}>
      <input
        css={[s.input.input, isFocused ? s.input.focused : s.input.unFocused]}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        type="text"
        {...focusHandlers}
      />
    </form>
  );
};

export default TextFormInput;

const s = {
  input: {
    input: tw`focus:outline-none outline-none border rounded-sm`,
    focused: tw`border-gray-500 px-3 py-2 transition-all ease-in duration-75`,
    unFocused: tw`p-0 border-transparent transition-all ease-in duration-75`,
  },
};
