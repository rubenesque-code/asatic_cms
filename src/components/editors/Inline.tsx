import { useState } from "react";
import tw from "twin.macro";

const InlineTextEditor = ({
  initialValue,
  onUpdate,
  placeholder,
  disabled = false,
  minWidth = 50,
}: {
  initialValue: string | undefined;
  onUpdate: (text: string) => void;
  placeholder: string;
  disabled?: boolean;
  minWidth?: number;
}) => {
  const [value, setValue] = useState(initialValue || "");

  const widthValueLength = value.length ? value.length : placeholder.length;

  return (
    <input
      css={[s, tw`max-w-full`]}
      style={{
        width: `${widthValueLength}ch`,
        minWidth,
      }}
      value={value}
      onBlur={() => onUpdate(value)}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      type="text"
    />
  );
};

export default InlineTextEditor;

const s = tw`outline-none focus:outline-none placeholder:text-gray-placeholder`;
