import tw from "twin.macro";
import SummaryEditor from "^components/editors/tiptap/SummaryEditor";

const $Text = tw.div`font-serif-eng text-base mt-xs prose`;

export const Text_ = ({
  maxChars,
  text,
  updateSummary,
}: {
  maxChars: number;
  text: string | null | undefined;
  updateSummary: (text: string) => void;
}) => {
  return (
    <$Text style={{ width: "auto" }}>
      <SummaryEditor
        initialContent={text || ""}
        onUpdate={(text) => updateSummary(text)}
        maxChars={maxChars}
      />
    </$Text>
  );
};
