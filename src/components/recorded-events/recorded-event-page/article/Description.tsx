import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { StickyProvider } from "^context/StickyContext";

// todo: need scroll context

const Description = () => {
  const [{ body, id: translationId }, { updateBody }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <StickyProvider>
      <ArticleEditor
        initialContent={body || undefined}
        onUpdate={(body) => updateBody({ body })}
        placeholder="optional video description..."
        key={translationId}
      />
    </StickyProvider>
  );
};

export default Description;
