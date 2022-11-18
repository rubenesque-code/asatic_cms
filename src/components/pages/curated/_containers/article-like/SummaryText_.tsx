import useTruncateRichText from "^hooks/useTruncateRichText";

import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

export function SummaryText_({
  numChars,
  text,
  updateText,
}: {
  numChars?: number;
  text: string | null | undefined;
  updateText: (text: string) => void;
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
