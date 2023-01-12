import { useState, useEffect } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import tw from "twin.macro";

import useTruncateRichText from "^hooks/useTruncateRichText";

const SummaryEditor = ({
  initialContent,
  onUpdate,
  placeholder = "write here",
  maxChars,
}: {
  initialContent: string | undefined;
  onUpdate: (output: string) => void;
  placeholder?: string;
  maxChars: number;
}) => {
  const [value, setValue] = useState<{ status: "uninitialised" } | string>({
    status: "uninitialised",
  });

  const [unTruncated, setUnTruncated] = useState(initialContent);

  const { truncated } = useTruncateRichText(unTruncated, maxChars);

  useEffect(() => {
    if (typeof value === "string") {
      return;
    }
    setValue(truncated || "");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  if (typeof value === "object") {
    return <></>;
  }

  return (
    <ReactTextareaAutosize
      css={[tw`outline-none w-full`]}
      value={value}
      onBlur={() => {
        if (unTruncated?.length) {
          onUpdate(unTruncated);
        }
        setValue(truncated || "");
      }}
      onFocus={() => {
        setValue(unTruncated || "");
      }}
      onChange={(event) => {
        // only happens when focused
        setUnTruncated(event.target.value);
        setValue(event.target.value);
      }}
      placeholder={placeholder}
    />
  );
};

export default SummaryEditor;
