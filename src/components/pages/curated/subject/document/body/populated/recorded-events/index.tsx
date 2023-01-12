import tw from "twin.macro";
import { RecordedEvent } from "^types/recordedEvent";
import Swiper from "./swiper";

const RecordedEvents = ({
  recordedEvents,
}: {
  recordedEvents: RecordedEvent[];
}) => {
  return (
    <div css={[tw`border-b`]}>
      <div
        css={[
          tw`text-3xl font-serif-eng text-gray-700 mb-sm border-b pl-xs pb-sm pt-md border-t`,
        ]}
      >
        Videos
      </div>
      <Swiper recordedEvents={recordedEvents} />
    </div>
  );
};

export default RecordedEvents;
