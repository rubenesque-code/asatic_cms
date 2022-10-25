import DatePicker from "^components/date-picker";
import DocLanguages from "^components/DocLanguages";
import TextArea from "^components/editors/TextArea";
import { TypePopover } from "^components/rich-popover/recorded-event-type";
import {
  HandleEntityAuthors,
  HandleRecordedEventType,
} from "^components/_containers/handle-sub-entities";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import {
  $VideoTypeHeading,
  $Header,
  $Date,
  $Title,
  $Authors,
} from "../_styles";

const Header = () => (
  <$Header>
    <VideoType />
    <Date />
    <Title />
    <Authors />
  </$Header>
);

export default Header;

const VideoType = () => {
  return (
    <TypePopover>
      <$VideoTypeHeading>
        <HandleRecordedEventType />
      </$VideoTypeHeading>
    </TypePopover>
  );
};

const Date = () => {
  const [{ publishDate }, { updatePublishDate }] =
    RecordedEventSlice.useContext();

  return (
    <$Date>
      <DatePicker
        date={publishDate}
        onChange={(date) => updatePublishDate({ date })}
        placeholder="DATE"
      />
    </$Date>
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <$Title>
      <TextArea
        injectedValue={title}
        onBlur={(title) => updateTitle({ title })}
        placeholder="Title"
        key={translationId}
      />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <$Authors>
      <HandleEntityAuthors
        authorIds={authorsIds}
        activeLanguageId={activeLanguageId}
      />
    </$Authors>
  );
};
