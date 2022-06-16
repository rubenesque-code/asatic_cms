import { ReactElement, useState } from "react";
import tw from "twin.macro";

/** inline text editor with relative div wrapper for children */
const InlineTextEditor = ({
  initialValue,
  onUpdate,
  placeholder,
  disabled = false,
  minWidth = 50,
  children,
}: {
  initialValue: string | undefined;
  onUpdate: (text: string) => void;
  placeholder: string;
  disabled?: boolean;
  minWidth?: number;
  children?:
    | ReactElement
    | (({ isFocused }: { isFocused: boolean }) => ReactElement);
}) => {
  const [value, setValue] = useState(initialValue || "");
  const [isFocused, setIsFocused] = useState(false);

  const widthValueLength = value.length ? value.length : placeholder.length;

  return (
    <div css={[tw`relative`]}>
      <input
        css={[s, tw`max-w-full`]}
        style={{
          width: `${widthValueLength}ch`,
          minWidth,
        }}
        value={value}
        onBlur={() => {
          setIsFocused(false);
          onUpdate(value);
        }}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        disabled={disabled}
        type="text"
      />
      {!children
        ? null
        : typeof children === "function"
        ? children({ isFocused })
        : children}
    </div>
  );
};

export default InlineTextEditor;

const s = tw`outline-none focus:outline-none placeholder:text-gray-placeholder`;
