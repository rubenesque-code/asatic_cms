import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import DocLanguages from "^components/DocLanguages";
import TextArea from "^components/editors/TextArea";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import TypePopover from "^components/rich-popover/recorded-event-type";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import InlineTextEditor from "^components/editors/Inline";
import {
  Header as HeaderContainer,
  DocTypeHeading,
  Title as Title_,
  Authors as Authors_,
} from "./styles";

// todo: need to add a Date

export default function Header() {
  return (
    <HeaderContainer>
      <Type />
      <Title />
      <Authors />
    </HeaderContainer>
  );
}

const Type = () => {
  return (
    <TypePopover>
      <TypeLabel />
    </TypePopover>
  );
};

const TypeLabel = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  return (
    <DocTypeHeading css={[tw`cursor-pointer`]}>
      {!recordedEventTypeId ? <TypeEmpty /> : <TypePopulated />}
    </DocTypeHeading>
  );
};

const TypeEmpty = () => {
  return <p css={[tw`text-gray-placeholder`]}>Video type</p>;
};

const TypePopulated = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();
  const recordedEventType = useSelector((state) =>
    selectRecordedEventTypeById(state, recordedEventTypeId!)
  );

  return !recordedEventType ? (
    <TypeMissing />
  ) : (
    <RecordedEventTypeSlice.Provider recordedEventType={recordedEventType}>
      <TypeFound />
    </RecordedEventTypeSlice.Provider>
  );
};

const TypeMissing = () => {
  return <SubContentMissingFromStore subContentType="video type" />;
};

const TypeFound = () => {
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();
  const [{ translations }, { addTranslation, updateName }] =
    RecordedEventTypeSlice.useContext();

  const translation = translations.find((t) => t.languageId === languageId);

  const handleUpdateName = (name: string) => {
    if (translation) {
      updateName({ name, translationId: translation.id });
    } else {
      addTranslation({ languageId, name });
    }
  };

  return (
    <InlineTextEditor
      injectedValue={translation?.name}
      onUpdate={handleUpdateName}
      placeholder="Video type"
      key={languageId}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <Title_>
      <TextArea
        injectedValue={title}
        onBlur={(title) => updateTitle({ title })}
        placeholder="Title"
        key={translationId}
      />
    </Title_>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <Authors_>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </Authors_>
  );
};
