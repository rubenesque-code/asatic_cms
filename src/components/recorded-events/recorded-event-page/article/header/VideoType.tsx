import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import VideoTypePopover from "^components/rich-popover/recorded-event-type";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";

import { $VideoTypeHeading } from "../_styles";
import MissingTranslation from "^components/MissingTranslation";
import WithTooltip from "^components/WithTooltip";

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
      {!recordedEventTypeId ? <Empty /> : <Populated />}
    </$VideoTypeHeading>
  );
};

const Empty = () => {
  return <p css={[tw`text-gray-placeholder`]}>Video type</p>;
};

const Populated = () => {
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

const Missing = () => {
  return <SubContentMissingFromStore subContentType="video type" />;
};

const Found = () => {
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();
  const [{ translations }] = RecordedEventTypeSlice.useContext();

  const translation = translations.find((t) => t.languageId === languageId);

  return (
    <>
      {translation?.name?.length ? (
        translation.name
      ) : (
        <p css={[tw`relative text-gray-placeholder`]}>
          video type...
          <WithTooltip text="missing translation">
            <span css={[tw`absolute right-0 top-0 -translate-y-1/2`]}>
              <MissingTranslation />
            </span>
          </WithTooltip>
        </p>
      )}
    </>
  );
};
