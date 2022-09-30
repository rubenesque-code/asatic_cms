import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

// todo: need scroll context

const Description = () => {
  const [{ body, id: translationId }, { updateBody }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <ArticleEditor
      initialContent={body || undefined}
      onUpdate={(body) => updateBody({ body })}
      placeholder="optional video description..."
      key={translationId}
    />
  );
};

export default Description;
