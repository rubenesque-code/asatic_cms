import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import VideoSection from "^components/display-entity/entity-page/article/VideoSection";

export default function Empty() {
  const [, { updateVideoSrc }] = RecordedEventSlice.useContext();

  return (
    <VideoSection.Empty
      updateVideoSrc={(youtubeId) => updateVideoSrc({ youtubeId })}
    />
  );
}
