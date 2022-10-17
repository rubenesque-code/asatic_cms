import TagSlice from "^context/tags/TagContext";
import { useComponentContext } from "../../../Context";

import InlineTextEditor from "^components/editors/Inline";
import {
  $Entity,
  $MissingTranslationText as $MissingText,
} from "^components/rich-popover/_presentation/RelatedEntities";
import { $TranslationText as $Text } from "^components/rich-popover/_styles/relatedEntities";

const Found = () => {
  const [{ parentType }, { removeTagFromParent }] = useComponentContext();
  const [{ id: tagId }] = TagSlice.useContext();

  return (
    <$Entity
      activeTranslations={["_"].map((_, i) => (
        <TagText key={i} />
      ))}
      removeFromParent={{
        func: () => removeTagFromParent(tagId),
        entityType: "tag",
        parentType,
      }}
    />
  );
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
        {!text.length ? () => <$MissingText /> : null}
      </InlineTextEditor>
    </$Text>
  );
};

export default Found;
