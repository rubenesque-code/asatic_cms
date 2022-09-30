import ContentMenu from "^components/menus/Content";
import VideoSection from "^components/display-content/entity-page/article/VideoSection";
import MediaSection from "^components/display-content/entity-page/article/MediaSection";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import tw from "twin.macro";

export default function Populated() {
  return (
    <MediaSection>
      {(isHovered) => (
        <>
          <Video />
          <Menu isShowing={isHovered} />
        </>
      )}
    </MediaSection>
  );
}

const Video = () => {
  const [{ youtubeId }] = RecordedEventSlice.useContext();

  return <VideoSection.Video youtubeId={youtubeId!} />;
};

function Menu({ isShowing }: { isShowing: boolean }) {
  const [, { updateVideoSrc }] = RecordedEventSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute top-0 right-0`}>
      <VideoSection.MenuButtons
        updateVideoSrc={(youtubeId) => updateVideoSrc({ youtubeId })}
      />
    </ContentMenu>
  );
}
