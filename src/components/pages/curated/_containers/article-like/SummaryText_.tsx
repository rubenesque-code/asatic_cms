import { JSONContent } from "@tiptap/core";

import useTruncateRichText from "^hooks/useTruncateRichText";

import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

export function SummaryText_({
  numChars,
  text,
  updateText,
}: {
  numChars?: number;
  text: JSONContent | null | undefined;
  updateText: (text: JSONContent) => void;
}) {
  const { editorKey, truncated } = useTruncateRichText(text, numChars);

  return (
    <SimpleTipTapEditor
      placeholder="Summary"
      initialContent={truncated || undefined}
      onUpdate={updateText}
      key={editorKey}
    />
  );
}
