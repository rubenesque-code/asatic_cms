import tw from "twin.macro";
import TextArea from "^components/editors/TextArea";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import {
  DescriptionContainer,
  DocTypeHeading,
  Title as Title_,
  DescriptionText as DescriptionText_,
} from "./style";

const Description = () => {
  return (
    <DescriptionContainer>
      <DocTypeHeading>Collection</DocTypeHeading>
      <Title />
      <DescriptionText />
    </DescriptionContainer>
  );
};

export default Description;

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    CollectionTranslationSlice.useContext();

  return (
    <Title_>
      <TextArea
        injectedValue={title}
        onBlur={(title) => updateTitle({ title })}
        placeholder="Title"
        styles={tw`bg-transparent`}
        // styles={descriptionBackground}
        key={translationId}
      />
    </Title_>
  );
};

const DescriptionText = () => {
  const [{ id: translationId, description }, { updateDescription }] =
    CollectionTranslationSlice.useContext();

  return (
    <DescriptionText_>
      <SimpleTipTapEditor
        initialContent={description}
        onUpdate={(description) => updateDescription({ description })}
        placeholder="Description"
        useDarkPlaceholder
        key={translationId}
      />
    </DescriptionText_>
  );
};
