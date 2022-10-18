import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import DocLanguages from "^components/DocLanguages";
import TextArea from "^components/editors/TextArea";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import VideoType from "./VideoType";
import { $Header, $Date, $Title, $Authors } from "../_styles";
import DatePicker from "^components/date-picker";

// todo: need to add a Date

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
