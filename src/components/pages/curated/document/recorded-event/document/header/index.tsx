// import DatePicker from "^components/date-picker";
import TextArea from "^components/editors/TextArea";
import { AuthorsPopover_ } from "^components/rich-popover";
import { TypePopover } from "^components/rich-popover/recorded-event-type";
import {
  HandleEntityAuthors,
  HandleRecordedEventType,
} from "^components/_containers/handle-sub-entities";
import { useEntityLanguageContext } from "^context/EntityLanguages";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import {
  $VideoTypeHeading,
  $Header,
  // $Date,
  $Title,
  $Authors,
} from "../_styles";

const Header = () => (
  <$Header>
    <VideoType />
    {/* <Date /> */}
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

/* const Date = () => {
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
}; */

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
  const [
    { id: authorId, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToArticle,
      removeRelatedEntity: removeRelatedEntityFromArticle,
    },
  ] = RecordedEventSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <AuthorsPopover_
      parentEntity={{
        activeLanguageId,
        addAuthor: (authorId) =>
          addRelatedEntityToArticle({
            relatedEntity: { id: authorId, name: "author" },
          }),
        authorsIds,
        id: authorId,
        name: "recordedEvent",
        removeAuthor: (authorId) =>
          removeRelatedEntityFromArticle({
            relatedEntity: { id: authorId, name: "author" },
          }),
        translationLanguagesIds: languagesIds,
      }}
    >
      <$Authors>
        <HandleEntityAuthors
          authorIds={authorsIds}
          activeLanguageId={activeLanguageId}
        />
      </$Authors>
    </AuthorsPopover_>
  );
};
