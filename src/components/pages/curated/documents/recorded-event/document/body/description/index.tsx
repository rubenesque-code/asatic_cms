import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import RichEditor from "^components/editors/tiptap/RichEditor";
import tw from "twin.macro";

const Description = () => {
  const [{ body, id: translationId }, { updateBody }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <div css={[tw`mt-md`]}>
      <RichEditor
        initialContent={body || undefined}
        onUpdate={(body) => updateBody({ body })}
        placeholder="optional video description..."
        key={translationId}
      />
    </div>
  );
};

export default Description;
