import { useDispatch, useSelector } from "^redux/hooks";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventTypeTranslationSlice from "^context/recorded-event-types/RecordedEventTypeTranslationContext";
import { ReactElement } from "react";
import { RecordedEventType } from "^types/recordedEvent";
import InlineTextEditor from "^components/editors/Inline";
import tw from "twin.macro";

const Type = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  const recordedEventType = useSelector((state) =>
    selectRecordedEventTypeById(state, recordedEventTypeId!)
  );

  return !recordedEventType ? (
    <Missing />
  ) : (
    <RecordedEventTypeSlice.Provider recordedEventType={recordedEventType}>
      <Found />
    </RecordedEventTypeSlice.Provider>
  );
};

export default Type;

const Missing = () => {
  return <SubContentMissingFromStore subContentType="Video type" />;
};

const Found = () => {
  return (
    <div>
      <ActiveTranslations />
    </div>
  );
};

const ActiveTranslations = () => {
  const [{ languagesIds: recordedEventLanguagesIds }] =
    RecordedEventSlice.useContext();
  const [{ languageId: activeLanguageId }] =
    RecordedEventTranslationSlice.useContext();
  const [{ languagesIds: recordedEventTypeLanguagesIds }] =
    RecordedEventTypeSlice.useContext();

  const recordedEventLanguagesIdsOrdered = recordedEventLanguagesIds.sort(
    (a, b) => {
      if (a === activeLanguageId) {
        return -1;
      } else if (b === activeLanguageId) {
        return 1;
      } else {
        return 0;
      }
    }
  );

  return (
    <div css={[tw`flex gap-sm`]}>
      {recordedEventLanguagesIdsOrdered.map((languageId) => (
        <ActiveTranslation languageId={languageId} key={languageId} />
      ))}
    </div>
  );
};

const ActiveTranslation = ({ languageId }: { languageId: string }) => {
  const [{ translations }, { addTranslation, updateName }] =
    RecordedEventTypeSlice.useContext();

  const translation = translations.find(
    (translation) => translation.languageId === languageId
  );

  const handleUpdateName = (name: string) => {
    if (translation) {
      updateName({ name, translationId: translation.id });
    } else {
      addTranslation({ languageId, name });
    }
  };

  return (
    <InlineTextEditor
      injectedValue={translation?.name || ""}
      onUpdate={handleUpdateName}
      placeholder="video type"
    />
  );
};
