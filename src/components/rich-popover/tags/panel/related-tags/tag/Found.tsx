import { useSelector } from "^redux/hooks";
import { selectTagAsChildStatus } from "^redux/state/complex-selectors/entity-status/tag";

import TagSlice from "^context/tags/TagContext";

import InlineTextEditor from "^components/editors/Inline";
import {
  $MissingTranslationText as $MissingText,
  $Entity_,
} from "^components/rich-popover/_presentation";
import { $TranslationText as $Text } from "^components/rich-popover/_styles/relatedEntities";

const Found = () => {
  const [tag] = TagSlice.useContext();

  const status = useSelector((state) => selectTagAsChildStatus(state, tag));

  return <$Entity_ status={status} text={<TagText />} />;
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
