import tw from "twin.macro";
import SummaryEditor from "^components/editors/tiptap/SummaryEditor";

const $Text = tw.div` mt-xs font-serif-eng text-base prose`;

export const Text_ = ({
  maxCharacters,
  text,
  updateSummary,
}: {
  maxCharacters: number;
  text: string | null | undefined;
  updateSummary: (text: string) => void;
}) => {
  return (
    <$Text style={{ width: "auto" }}>
      <SummaryEditor
        initialContent={text || ""}
        onUpdate={(text) => updateSummary(text)}
        maxChars={maxCharacters}
      />
    </$Text>
  );
};
