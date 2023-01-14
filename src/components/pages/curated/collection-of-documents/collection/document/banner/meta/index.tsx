import tw from "twin.macro";

import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import TextArea from "^components/editors/TextArea";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import {
  $MetaContainer,
  $EntityTypeHeading,
  $MetaTitle,
  $MetaText,
} from "../_styles";

const Meta = () => {
  return (
    <$MetaContainer>
      <$EntityTypeHeading>Collection</$EntityTypeHeading>
      <Title />
      <MetaText />
    </$MetaContainer>
  );
};

export default Meta;

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    CollectionTranslationSlice.useContext();

  return (
    <$MetaTitle>
      <TextArea
        injectedValue={title}
        onBlur={(title) => updateTitle({ title })}
        placeholder="Title"
        styles={tw`bg-transparent`}
        key={translationId}
      />
    </$MetaTitle>
  );
};

const MetaText = () => {
  const [{ id: translationId, description }, { updateDescription }] =
    CollectionTranslationSlice.useContext();

  return (
    <$MetaText>
      <SimpleTipTapEditor
        initialContent={description}
        onUpdate={(description) => updateDescription({ description })}
        placeholder="Description"
        useDarkPlaceholder
        key={translationId}
      />
    </$MetaText>
  );
};
