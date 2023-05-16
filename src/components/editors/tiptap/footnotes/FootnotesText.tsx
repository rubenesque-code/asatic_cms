import produce from "immer";
import DOMPurify from "dompurify";
import tw from "twin.macro";

import TextArea from "^components/editors/TextArea";

import { Footnote } from "^types/article-like-entity";

const FootnotesText = ({
  footnotes,
  updateFootnoteText,
}: {
  footnotes: Footnote[];
  updateFootnoteText: ({ id, text }: { id: string; text: string }) => void;
}) => {
  const footnotesSorted = produce(footnotes, (draft) =>
    draft.sort((a, b) => a.num - b.num)
  );
  return (
    <div css={[tw`mt-lg border-t pt-md flex flex-col gap-sm`]}>
      {footnotesSorted.map((footnote) => (
        <div css={[tw`relative flex items-center gap-sm`]} key={footnote.id}>
          <sup css={[tw`text-gray-700`]}>{footnote.num}</sup>
          <TextArea
            injectedValue={footnote.text}
            onBlur={(text) => {
              const clean = DOMPurify.sanitize(text);
              updateFootnoteText({ id: footnote.id, text: clean });
            }}
            placeholder="footnote..."
            styles={tw`italic text-gray-700`}
          />
        </div>
      ))}
    </div>
  );
};

export default FootnotesText;
