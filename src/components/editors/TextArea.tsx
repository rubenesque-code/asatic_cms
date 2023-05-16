import { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import tw, { TwStyle } from "twin.macro";
import * as DOMPurify from "dompurify";

const TextArea = ({
  injectedValue,
  onBlur,
  placeholder = "write here",
  styles,
}: {
  injectedValue: string | undefined | null;
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
      onBlur={() => {
        const clean = DOMPurify.sanitize(value);
        onBlur(clean);
      }}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      placeholder={placeholder}
    />
  );
};

export default TextArea;
