import { YoutubeVideoIcon } from "^components/Icons";
import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";

export const UpdateVideoSrcButton_ = ({
  updateVideoSrc,
}: {
  updateVideoSrc: (youtubeId: string) => void;
}) => (
  <WithAddYoutubeVideo onAddVideo={(youtubeId) => updateVideoSrc(youtubeId)}>
    <ContentMenu.Button tooltipProps={{ text: "change video" }}>
      <YoutubeVideoIcon />
    </ContentMenu.Button>
  </WithAddYoutubeVideo>
);
