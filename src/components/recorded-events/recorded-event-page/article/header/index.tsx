import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import DocLanguages from "^components/DocLanguages";
import TextArea from "^components/editors/TextArea";
import DocAuthorsText from "^components/authors/DocAuthorsText";
// import VideoType from "./VideoType";
import {
  $Header,
  $Date,
  $Title,
  $Authors,
  $VideoTypeHeading,
} from "../_styles";
import DatePicker from "^components/date-picker";
import HandleRecordedEventType from "^components/_containers/HandleRecordedEventType";
import VideoTypePopover from "^components/rich-popover/recorded-event-type";

export default function Header() {
  return (
    <$Header>
      <VideoType />
      <Date />
      <Title />
      <Authors />
    </$Header>
  );
}

const VideoType = () => {
  return (
    <VideoTypePopover>
      <$VideoTypeHeading>
        <HandleRecordedEventType />
      </$VideoTypeHeading>
    </VideoTypePopover>
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
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </$Authors>
  );
};
