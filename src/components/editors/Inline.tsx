import { nanoid } from "@reduxjs/toolkit";
import { ReactElement, useEffect, useState } from "react";
import { useMeasure } from "react-use";
import tw from "twin.macro";

// todo| Nice to have
// todo: logic is not great. e.g. value changing through injected value after an undo doesn't cause a rerender, and so sizing is wrong
// todo: 'edit' style cursor
// todo: tooltip disabled on focus

/** inline text editor with relative div wrapper for children */
const InlineTextEditor = ({
  injectedValue,
  onUpdate,
  placeholder,
  disabled = false,
  minWidth = 50,
  trailingSpace = 10,
  id = nanoid(),
  children,
}: {
  injectedValue: string | undefined;
  onUpdate: (text: string) => void;
  placeholder: string;
  disabled?: boolean;
  minWidth?: number;
  trailingSpace?: number;
  id?: string;
  children?:
    | ReactElement
    | (({ isFocused }: { isFocused: boolean }) => ReactElement)
    | null;
}) => {
  const [value, setValue] = useState(injectedValue || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (injectedValue !== value) {
      setValue(injectedValue || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectedValue]);

  const [dummyInputRef, { width: dummyInputWidth }] =
    useMeasure<HTMLParagraphElement>();

  const inputWidth = dummyInputWidth;
  const inputWidthEditing = dummyInputWidth + trailingSpace;

  return (
    <div css={[tw`relative flex items-center gap-xs`]}>
      <input
        id={id}
        css={[s, tw`max-w-full bg-white`]}
        style={{
          width: isFocused ? inputWidthEditing : inputWidth,
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
      <p css={[tw`absolute whitespace-nowrap invisible`]} ref={dummyInputRef}>
        {/* <p css={[tw`absolute whitespace-nowrap invisible`]} ref={inputWidthElRef}> */}
        {value.length ? value : placeholder}
      </p>
      {!children || isFocused ? null : typeof children === "function" ? (
        <label
          css={[
            tw`cursor-text absolute left-0 top-1/2 -translate-y-1/2 w-full`,
          ]}
          htmlFor={id}
        >
          {children({ isFocused })}
        </label>
      ) : (
        children
      )}
    </div>
  );
};

export default InlineTextEditor;

const s = tw`outline-none focus:outline-none placeholder:text-gray-placeholder`;
