import TagSlice from "^context/tags/TagContext";

import InlineTextEditor from "^components/editors/Inline";
import { $MissingTranslationText as $MissingText } from "^components/rich-popover/_presentation/RelatedEntities";
import { $TranslationText as $Text } from "^components/rich-popover/_styles/relatedEntities";

const Found = () => {
  return <TagText />;
};

const TagText = () => {
  const [{ text }, { updateText }] = TagSlice.useContext();

  const handleUpdateName = (text: string) => {
    updateText({ text });
  };

  return (
    <$Text>
      <InlineTextEditor
        injectedValue={text}
        onUpdate={handleUpdateName}
        placeholder=""
      >
        {!text?.length ? () => <$MissingText /> : null}
      </InlineTextEditor>
    </$Text>
  );
};

export default Found;
