import tw from "twin.macro";
import InlineTextEditor from "^components/editors/Inline";
import TagSlice from "^context/tags/TagContext";

const Translations = () => {
  return (
    <div css={[tw`text-gray-700 mr-xs whitespace-nowrap font-serif-eng`]}>
      <Text />
    </div>
  );
};

export default Translations;

const Text = () => {
  const [{ text }, { updateText }] = TagSlice.useContext();

  return (
    <InlineTextEditor
      injectedValue={text}
      onUpdate={(text) => {
        updateText({ text });
      }}
      placeholder="text..."
    />
  );
};
