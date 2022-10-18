import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import InlineTextEditor from "^components/editors/Inline";
import VideoTypePopover from "^components/rich-popover/recorded-event-type";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";

import { $VideoTypeHeading } from "../_styles";

const VideoType = () => {
  return (
    <VideoTypePopover>
      <Label />
    </VideoTypePopover>
  );
};

export default VideoType;

const Label = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  return (
    <$VideoTypeHeading>
      {!recordedEventTypeId ? <TypeEmpty /> : <TypePopulated />}
    </$VideoTypeHeading>
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
