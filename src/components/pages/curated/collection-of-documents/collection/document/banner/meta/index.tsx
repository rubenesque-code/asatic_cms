import tw from "twin.macro";

import TextArea from "^components/editors/TextArea";
import SummaryEditor from "^components/editors/SummaryEditor";
import {
  $MetaContainer,
  $EntityTypeHeading,
  $MetaTitle,
  $MetaText,
} from "../_styles";
import CollectionSlice from "^context/collections/CollectionContext";

const Meta = () => {
  return (
    <$MetaContainer>
      <$EntityTypeHeading>Collection</$EntityTypeHeading>
      <Title />
      <Description />
    </$MetaContainer>
  );
};

export default Meta;

const Title = () => {
  const [{ title }, { updateTitle }] = CollectionSlice.useContext();

  return (
    <$MetaTitle>
      <TextArea
        injectedValue={title}
        onBlur={(title) => updateTitle({ title })}
        placeholder="Title"
        styles={tw`bg-transparent`}
      />
    </$MetaTitle>
  );
};

const Description = () => {
  const [{ description }, { updateDescription }] = CollectionSlice.useContext();

  return (
    <$MetaText>
      <SummaryEditor
        entityText={description}
        onUpdate={(description) => updateDescription({ description })}
        placeholder="Description"
        maxChars={1000}
        tooltip={null}
      />
    </$MetaText>
  );
};
