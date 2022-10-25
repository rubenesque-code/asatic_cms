import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import RichEditor from "^components/editors/tiptap/RichEditor";

const Description = () => {
  const [{ body, id: translationId }, { updateBody }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <RichEditor
      initialContent={body || undefined}
      onUpdate={(body) => updateBody({ body })}
      placeholder="optional video description..."
      key={translationId}
    />
  );
};

export default Description;
