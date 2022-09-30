import VideoSection from "^components/display-content/entity-page/article/VideoSection";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

export default function Empty() {
  const [{}, { updateVideoSrc }] = RecordedEventSlice.useContext();

  return (
    <VideoSection.Empty
      updateVideoSrc={(youtubeId) => updateVideoSrc({ youtubeId })}
    />
  );
}
