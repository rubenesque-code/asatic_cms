import { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import tw, { TwStyle } from "twin.macro";

const TextArea = ({
  injectedValue,
  onBlur,
  placeholder = "write here",
  styles,
}: {
  injectedValue: string | undefined;
  onBlur: (value: string) => void;
  placeholder?: string;
  styles?: TwStyle;
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (injectedValue !== value) {
      setValue(injectedValue || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectedValue]);

  return (
    <ReactTextareaAutosize
      css={[tw`outline-none w-full`, styles]}
      value={value}
      onBlur={(event) => {
        onBlur(event.target.value);
      }}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      placeholder={placeholder}
    />
  );
};

export default TextArea;
