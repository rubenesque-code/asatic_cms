import { ReactElement } from "react";
import { YoutubeLogo } from "phosphor-react";

import { getYoutubeEmbedUrlFromId } from "^helpers/youtube";

import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";
import ContainerUtility from "^components/ContainerUtilities";
import VideoIFrame from "^components/video/IFrame";

import MediaSection from "./MediaSection";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function VideoSection() {}

VideoSection.Video = function Video_({ youtubeId }: { youtubeId: string }) {
  const url = getYoutubeEmbedUrlFromId(youtubeId!);

  return (
    <ContainerUtility.Width>
      {(width) => (
        <VideoIFrame height={(width * 9) / 16} src={url} width={width} />
      )}
    </ContainerUtility.Width>
  );
};

VideoSection.MenuButtons = function MenuButtons({
  updateVideoSrc,
}: {
  updateVideoSrc: (youtubeId: string) => void;
}) {
  return (
    <>
      <WithAddYoutubeVideo
        onAddVideo={(youtubeId) => updateVideoSrc(youtubeId)}
      >
        <ContentMenu.Button tooltipProps={{ text: "change video" }}>
          <YoutubeLogo />
        </ContentMenu.Button>
      </WithAddYoutubeVideo>
    </>
  );
};

VideoSection.Empty = function Empty({
  children,
  updateVideoSrc,
}: {
  children?: (isHovered: boolean) => ReactElement;
  updateVideoSrc: (imageId: string) => void;
}) {
  return (
    <MediaSection.Empty title="Video section">
      {(isHovered) => (
        <>
          <WithAddYoutubeVideo onAddVideo={updateVideoSrc}>
            <MediaSection.Empty.AddContentButton text="Add video">
              <YoutubeLogo />
            </MediaSection.Empty.AddContentButton>
          </WithAddYoutubeVideo>
          {children ? children(isHovered) : null}
        </>
      )}
    </MediaSection.Empty>
  );
};
